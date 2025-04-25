import { useState } from 'react';
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
  Space,
  message,
  Flex,
} from 'antd';
import type { FormInstance } from 'antd';

const AddAssetModal = ({ form }: { form: FormInstance }) => {
  const [addMultiple, setAddMultiple] = useState(false);
  const [tempAssets, setTempAssets] = useState<any[]>([]);

  const handleAddToList = async () => {
    try {
      const values = await form.validateFields();
      const newAsset = {
        ...values,
        key: `${values.assetTag}-${Date.now()}`,
      };
      setTempAssets([...tempAssets, newAsset]);
      form.resetFields();
    } catch (err) {
      message.error('Please fill in all the information before adding to the list');
    }
  };

  const handleRemove = (key: string) => {
    setTempAssets(tempAssets.filter(item => item.key !== key));
  };
  
  const columns = [
    { title: 'Template Name', dataIndex: 'templateName', key: 'templateName' },
    { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
    { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate' },
    { title: 'Warranty Expiry', dataIndex: 'warrantyExpiry', key: 'warrantyExpiry' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Action',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button danger size="small" onClick={() => handleRemove(record.key)}>
          Delete
        </Button>
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
        Add more assets
      </Checkbox>

      <Form form={form} layout="vertical" name="assetForm">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Template Name"
              name="templateName"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Template">
                <Select.Option value="Active">Active</Select.Option>
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
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Warranty Expiry" name="warrantyExpiry">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Location" name="location">
              <Select placeholder="Select location">
                <Select.Option value="Location 1">Location 1</Select.Option>
                <Select.Option value="Location 2">Location 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select status">
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {addMultiple && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Button type="primary" onClick={handleAddToList}>
                Add to List
              </Button>
          </div>
        )}
      </Form>

      {addMultiple && (
        <div style={{ marginTop: 24 }}>
          <Table
            dataSource={tempAssets}
            columns={columns}
            rowKey="key"
            size="small"
            pagination={false}
          />
        </div>
      )}
    </>
  );
};

export default AddAssetModal;
