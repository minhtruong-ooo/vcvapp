import { useState, useEffect } from 'react'
import type { FormInstance } from "antd";
import { Form, Input, Button, Select, Row, Col, Switch, Card } from "antd";
import { useKeycloak } from "@react-keycloak/web";

const AddAssetAssignmentModal = ({
  form,
  onCancel,
  onAdd,
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
  const [loadingSelects, setLoadingSelects] = useState(true);



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
                >
                  {/* {templates.map((template) => (
                  <Select.Option
                    key={template.templateID}
                    value={template.templateName}
                  >
                    {template.templateName}
                  </Select.Option>
                ))} */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Department" name="department">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Notes" name="notes">
                <Input placeholder='' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Assign Asset" style={{ marginTop: 16 }}>
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
                >
                  {/* {templates.map((template) => (
                  <Select.Option
                    key={template.templateID}
                    value={template.templateName}
                  >
                    {template.templateName}
                  </Select.Option>
                ))} */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Department" name="department">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Notes" name="notes">
                <Input placeholder='' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>             
    </>
  )
}

export default AddAssetAssignmentModal