import { Form, Row, Col, Input, Select, DatePicker } from 'antd';

const AddAssetModal = ({ form }: { form: any }) => {
  return (
    <Form form={form} layout="vertical" name="assetForm">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Asset Tag" name="assetTag" rules={[{ required: true, message: 'Please enter Asset Tag' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Template Name" name="templateName" rules={[{ required: true }]}>
            <Select placeholder="Select Template"></Select>
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
          <Form.Item label="Status" name="status">
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Location" name="location">
            <Select placeholder="Select location">
              <Select.Option value={1}>Location 1</Select.Option>
              <Select.Option value={2}>Location 2</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddAssetModal;
