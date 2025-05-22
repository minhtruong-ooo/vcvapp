// AddAssetAssignmentModal.tsx
import React, { useState, useEffect } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Select, Row, Col, Switch, Card, message, Button, Spin, DatePicker } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import { getUnusedAssets, getAssignedAssets, createAssignment } from '../../api/assetAssignmentAPI';
import { getEmployeeSingle } from '../../api/employeeAPI';
import type { TransferItem } from 'antd/es/transfer';
import TableTransfer from '../TableTransfer';

interface AddAssetAssignmentModalProps {
  form: FormInstance;
  onCancel: () => void;
  onAdd: (newAsset: any) => void;
  onSuccess: () => void;
}

interface AssetItem extends TransferItem {
  assetID: string;
  assetTag: string;
  assetName: string;
  serialNumber: string;
}

const AddAssetAssignmentModal: React.FC<AddAssetAssignmentModalProps> = ({
  form,
  onCancel,
  // onAdd,
  onSuccess,
}) => {
  const { keycloak } = useKeycloak();
  const token = keycloak?.token;
  const assignmentBy = keycloak.tokenParsed?.employeeID;
  const [loadingSelects, setLoadingSelects] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [employees, setEmployee] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [isAssignMode, setIsAssignMode] = useState(true);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState<string>("");
  const [employeeChangeLoading, setEmployeeChangeLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoadingSelects(true);
    fetchEmployees();
    fetchAssets(); // Default: load unused assets for assignment
  }, [token]);

  const fetchAssets = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const usedAssets = await getUnusedAssets(token);
      const processedAssets = usedAssets.map((item: any) => ({
        ...item,
        key: String(item.assetTag),
        assetID: String(item.assetID),
        assetTag: String(item.assetTag),
      }));
      setAssets(processedAssets);
    } catch (error) {
      console.error('Error fetching assets: ', error);
      message.error('Error fetching assets: ' + error);
    } finally {
      setLoading(false);
      setLoadingSelects(false);
    }
  };

  const fetchAssignedAssets = async (employeeID: string) => {
    try {
      if (!token) return;
      setLoading(true);
      const assignedAssets = await getAssignedAssets(token, employeeID);
      const processedAssets = assignedAssets.map((item: any) => ({
        ...item,
        key: String(item.assetID),
        assetID: String(item.assetID),
        assetTag: String(item.assetTag),
        detailID: String(item.detailID),
      }));
      setAssets(processedAssets);
    } catch (error) {
      console.error('Error fetching assigned assets: ', error);
      message.error('Error fetching assigned assets: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const responseData = await getEmployeeSingle(keycloak.token ?? "");
      setEmployee(responseData);
    } catch (error: any) {
      message.error("Error fetching employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = async (employeeID: string) => {
    setSelectedEmployeeID(employeeID);
    if (!isAssignMode) {
      setEmployeeChangeLoading(true);
      try {
        await fetchAssignedAssets(employeeID);
      } catch (err) {
        message.error("Lỗi khi load tài sản của nhân viên");
      } finally {
        setEmployeeChangeLoading(false);
      }
    }
  };

  const handleModeChange = (checked: boolean) => {
    setIsAssignMode(checked);
    setAssets([]);
    setTargetKeys([]);
    if (checked) {
      fetchAssets();
    } else if (selectedEmployeeID) {
      fetchAssignedAssets(selectedEmployeeID);
    }
  };

  const handleSave = async () => {
    try {
      if (!token) {
        message.error("Không có token xác thực. Vui lòng đăng nhập lại.");
        return;
      }

      const values = await form.validateFields();

      // Lọc các asset đã chọn từ bảng Transfer (bảng bên phải)
      const selectedAssets = assets.filter((asset) =>
        targetKeys.includes(asset.assetID)
      );

      // Lấy danh sách assetID (kiểu number) cho assets
      const mappedAssets = selectedAssets.map((asset) => ({
        assetID: Number(asset.assetID),
        detailID: isAssignMode ? null : Number(asset.detailID),
      }));


      const payload = {
        employeeId: Number(selectedEmployeeID),
        notes: values.notes,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        assignmentAction: isAssignMode ? "Assign" : "Return",
        assets: mappedAssets, 
        assignmentBy: Number(assignmentBy),
      };

      console.log("✅ Payload to send:", payload);
      const result = await createAssignment(token, payload);
      message.success(result.message || "Tạo bàn giao thành công!");
      onCancel();
      onSuccess();
    } catch (error: any) {
      console.error("❌ Error creating assignment:", error);
      message.error(error.message || "Đã xảy ra lỗi khi tạo bàn giao");
    }
  };

  return (
    <>
      <div>
        <Switch
          checkedChildren="Assign"
          unCheckedChildren="Return"
          checked={isAssignMode}
          onChange={handleModeChange}
        />
      </div>

      <Card title="General Information" style={{ marginTop: 16 }}>
        <Form form={form} layout="vertical" name="assetForm">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Employee"
                name="employeeID"
                rules={[{ required: true, message: 'Please select an employee' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Employee"
                  loading={loadingSelects}
                  onChange={(employeeID) => handleEmployeeSelect(employeeID)}
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {employees.map((employee) => (
                    <Select.Option
                      key={employee.employeeID}
                      value={employee.employeeID}
                    >
                      {employee.employeeInfo}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date" name="date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Notes" name="notes">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title={isAssignMode ? "Assign Assets" : "Return Assets"} style={{ marginTop: 16 }}>
        <Spin spinning={loading || employeeChangeLoading}>
          <TableTransfer
            dataSource={assets}
            targetKeys={targetKeys}
            onChange={setTargetKeys}
            titles={
              isAssignMode
                ? ['Unused Assets', 'Assets to Assign']
                : ['Assigned Assets', 'Assets to Return']
            }
          />
        </Spin>
      </Card>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSave} loading={loading} type="primary" style={{ marginRight: 8 }}>
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
};

export default AddAssetAssignmentModal;
