import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Table,
  message,
  Space,
} from "antd";
import dayjs from "dayjs";
import type { FormInstance } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import {
  GetAssetTemplates_Select,
  getLocations,
  getAssetStatuses,
  createAsset,
  createAssets,
} from "../../api/assetAPI";
import { AssetInput } from "../../interfaces/interfaces";
import { AssetMapper } from "../../interfaces/AssetMapper";

const AddAssetModal = ({
  form,
  onCancel,
  onSuccess,
}: {
  form: FormInstance;
  onCancel: () => void;
  onAdd: (newAsset: any) => void;
  onSuccess: () => void;
}) => {
  const { keycloak } = useKeycloak();
  const token = keycloak?.token;

  const [loading, setLoading] = useState(false);
  const [addMultiple, setAddMultiple] = useState(false);
  const [tempAssets, setTempAssets] = useState<any[]>([]);

  const [templates, setTemplates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loadingSelects, setLoadingSelects] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoadingSelects(true);
        const [templatesData, locationsData, statusesData] = await Promise.all([
          GetAssetTemplates_Select(token),
          getLocations(token),
          getAssetStatuses(token),
        ]);
        setTemplates(templatesData);
        setLocations(locationsData);
        setStatuses(statusesData);
      } catch (error) {
        console.error("Error loading select options", error);
      } finally {
        setLoadingSelects(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddToList = async () => {
    try {
      const values = await form.validateFields();
      const newAsset = {
        ...values,
        key: `${Math.random()}`,
      };
      setTempAssets([...tempAssets, newAsset]);
      form.resetFields();
    } catch (err) {
      message.error(
        "Please fill in all the information before adding to the list"
      );
    }
  };

  const handleRemove = (key: string) => {
    setTempAssets(tempAssets.filter((item) => item.key !== key));
  };

  const handleDuplicate = (index: number) => {
    const duplicated = { ...tempAssets[index] };

    // Gán key mới để React phân biệt
    duplicated.key = `${duplicated.key || index}-${Date.now()}`;

    const newAssets = [...tempAssets];
    newAssets.splice(index + 1, 0, duplicated); // Thêm ngay sau bản gốc

    setTempAssets(newAssets);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!token) {
        message.error("You are not authenticated. Please login again.");
        return;
      }

      const mapper = new AssetMapper({ templates, statuses, locations });

      if (addMultiple) {
        if (tempAssets.length === 0) {
          message.warning("The asset list is empty!");
          return;
        }

        const assetList = mapper.mapMany(tempAssets as AssetInput[]);
        await createAssets(token, assetList);
        message.success("Assets created successfully!");
      } else {
        // validateFields sẽ tự động throw lỗi nếu field nào đó thiếu
        const values = await form.validateFields();

        const singleAsset: AssetInput = {
          templateName: values.templateName,
          serialNumber: values.serialNumber,
          purchaseDate: values.purchaseDate,
          warrantyExpiry: values.warrantyExpiry,
          status: values.status,
          location: values.location,
        };

        const mappedAsset = mapper.map(singleAsset);
        await createAsset(token, mappedAsset);
        message.success("Asset created successfully!");
      }

      form.resetFields();
      onSuccess();
      setTempAssets([]);
      onCancel();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) {
        message.error("Please fill in all the required fields.");
      } else {
        message.error(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "No.",
      key: "no",
      width: 100,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: "Template Name", dataIndex: "templateName", key: "templateName" },
    { title: "Serial Number", dataIndex: "serialNumber", key: "serialNumber" },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date: any) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Warranty Expiry",
      dataIndex: "warrantyExpiry",
      key: "warrantyExpiry",
      render: (date: any) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "actions",
      render: (_: any, record: any, index: number) => (
        <Space>
          <Button danger size="small" onClick={() => handleRemove(record.key)}>
            Delete
          </Button>
          <Button size="small" onClick={() => handleDuplicate(index)}>
            Duplicate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Checkbox
        checked={addMultiple}
        onChange={(e) => setAddMultiple(e.target.checked)}
        style={{ marginBottom: 16 }}
      >
        Multiple Assets
      </Checkbox>

      <Form form={form} layout="vertical" name="assetForm">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Template Name"
              name="templateName"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select Template"
                loading={loadingSelects}
              >
                {templates.map((template) => (
                  <Select.Option
                    key={template.templateID}
                    value={template.templateName}
                  >
                    {template.templateName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Serial Number" name="serialNumber">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Purchase Date" name="purchaseDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Warranty Expiry" name="warrantyExpiry">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Location" name="location">
              <Select placeholder="Select Location" loading={loadingSelects}>
                {locations.map((loc) => (
                  <Select.Option key={loc.locationID} value={loc.locationName}>
                    {loc.locationName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select Status" loading={loadingSelects}>
                {statuses.map((status) => (
                  <Select.Option
                    key={status.statusID}
                    value={status.statusName}
                  >
                    {status.statusName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {addMultiple && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <Button type="primary" onClick={handleAddToList}>
              Add to List
            </Button>
          </div>
        )}
      </Form>

      {addMultiple && (
        <div
          style={{
            marginTop: 24,
            height: 300,
            overflowY: "auto",
          }}
        >
          <Table
            bordered
            dataSource={tempAssets}
            columns={columns}
            rowKey="key"
            size="small"
            pagination={false}
          />
        </div>
      )}

      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          loading={loading}
          type="primary"
          style={{ marginRight: 8 }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
};

export default AddAssetModal;
