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
  Card
} from "antd";
import dayjs from "dayjs";
import type { FormInstance } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import {
  getAssetTemplates_Select,
  getLocations,
  getAssetStatuses,
  getCompany,
  getOrigin,
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
  const assignmentBy = keycloak.tokenParsed?.employeeID;

  const [loading, setLoading] = useState(false);
  const [loadingSelects, setLoadingSelects] = useState(true);
  const [addMultiple, setAddMultiple] = useState(false);
  const [tempAssets, setTempAssets] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [origin, setOrigin] = useState<any[]>([]);
  const [company, setCompany] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoadingSelects(true);
        const [templatesData, locationsData, statusesData, originData, companyData] = await Promise.all([
          getAssetTemplates_Select(token),
          getLocations(token),
          getAssetStatuses(token),
          getOrigin(token),
          getCompany(token),
        ]);
        setTemplates(templatesData);
        setLocations(locationsData);
        setStatuses(statusesData);
        setOrigin(originData);
        setCompany(companyData);
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
      console.log("New Asset Added:", newAsset);
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

        const values = await form.validateFields();

        console.log("Form Values:", values);

        const singleAsset: AssetInput = {
          templateID: values.templateID,
          serialNumber: values.serialNumber,
          purchaseDate: values.purchaseDate,
          warrantyExpiry: values.warrantyExpiry,
          status: values.status,
          location: values.location,
          changeBy: assignmentBy || "Unknown",
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
    {
      title: "Template Name",
      dataIndex: "templateID",
      key: "templateName",
      render: (value: any) => {
        const templateName = templates.find((t) => t.templateID === value)?.templateName;
        return templateName || value;
      },
    },
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
    {
      title: "Managed By",
      dataIndex: "managedBy",
      key: "managedBy",
      render: (value: any) => {
        const companyName = company.find((c) => c.companyID === value)?.companyName;
        return companyName || value;
      },
    },
    {
      title: "Origin",
      dataIndex: "origin",
      key: "origin",
      render: (value: any) => {
        const originName = origin.find((o) => o.originID === value)?.originName;
        return originName || value;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: any) => {
        const statusName = statuses.find((s) => s.statusName === value)?.statusName;
        return statusName || value;
      },
    },
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


      <Card
        title="Asset Information"
        style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" name="assetForm">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Template"
                name="templateID"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Select Template"
                  loading={loadingSelects}
                  optionFilterProp="children"
                >
                  {templates.map((template) => (
                    <Select.Option
                      key={template.templateID}
                      value={template.templateID}
                    >
                      {template.templateName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Serial Number" name="serialNumber">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Purchase Date" name="purchaseDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Warranty Expiry" name="warrantyExpiry">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Managed By" name="managedBy">
                <Select placeholder="Select an asset management entity" loading={loadingSelects}>
                  {company.map((com) => (

                    <Select.Option
                      key={com.companyID}
                      value={com.companyID}
                    >
                      {com.companyName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Origin" name="origin">
                <Select placeholder="Select Origin" loading={loadingSelects}>
                  {origin.map((ori) => (
                    <Select.Option key={ori.originID} value={ori.originID}>
                      {ori.originName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>
            <Col span={6}>
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
            <Col span={6}>

            </Col>
          </Row>
        </Form>
      </Card>

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

      {addMultiple && (
        <div
          style={{
            marginTop: 24,
            overflowY: "auto",
            maxHeight: 200,
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
