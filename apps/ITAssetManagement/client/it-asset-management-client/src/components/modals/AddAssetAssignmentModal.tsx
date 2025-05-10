// AddAssetAssignmentModal.tsx
import React, { useState, useEffect } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Select, Row, Col, Switch, Card, message } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import { getUnusedAssets } from '../../api/assetAssignmentAPI';
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
  onAdd,
  onSuccess,
}) => {
  const { keycloak } = useKeycloak();
  const token = keycloak?.token;

  const [loadingSelects, setLoadingSelects] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (!token) return;
        setLoading(true);
        const usedAssets = await getUnusedAssets(token);
        console.log('Raw assets from API:', usedAssets);
        const processedAssets = usedAssets.map((item: any) => {
          const assetTag = String(item.assetTag); // Đảm bảo assetTag là string
          return {
            ...item,
            key: assetTag, // Dùng assetTag làm key
            assetID: String(item.assetID),
            assetTag: assetTag,
          };
        });
        console.log('Processed assets:', processedAssets);
        setAssets(processedAssets);
      } catch (error) {
        console.error('Error fetching assets: ', error);
        message.error('Error fetching assets: ' + error);
      } finally {
        setLoading(false);
        setLoadingSelects(false);
      }
    };

    fetchAssets();
  }, [token]);

  return (
    <>
      <div>
        <Switch checkedChildren="Assign" unCheckedChildren="Return" defaultChecked />
      </div>

      <Card title="Assign Information" style={{ marginTop: 16 }}>
        <Form form={form} layout="vertical" name="assetForm">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Employee"
                name="employeeName"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Select Employee"
                  loading={loadingSelects}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Department" name="department">
                <Input disabled />
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

      <Card loading={loading} title="Assign Asset" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <div style={{ width: '100%' }}>
            <TableTransfer
              dataSource={assets}
              targetKeys={targetKeys}
              onChange={setTargetKeys}
            />
          </div>
        </Row>
      </Card>
    </>
  );
};

export default AddAssetAssignmentModal;