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
    // const [specs, setSpecs] = useState<any[]>([]);
    // const [loadingSpec, setLoadingSpec] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);

    useEffect(() => {
      if (!token) return;

      

      const fetchData = async () => {
        try {
          setLoadingSelects(true);
          const [templatesData, locationsData, statusesData] = await Promise.all([
            getAssetTemplates_Select(token),
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


    // const handleTemplateChange = async (templateID: number) => {
    //   form.setFieldsValue({ templateID });
    //   if (!token) {
    //     message.error("You are not authenticated. Please login again.");
    //     return;
    //   }
    //   try {
    //     setLoadingSpec(true);
    //     const specsList = await getSpecs(token, templateID);
    //     setSpecs(specsList);
    //   } catch (err) {
    //     message.error("Không thể tải thông số tài sản.");
    //     console.error(err);
    //   } finally {
    //     setLoadingSpec(false);
    //   }
    // };


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

          console.log("Form Values:", values);
          console.log("Mapped Asset:", mappedAsset);
          console.log("Templates:", templates);


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
                    // optionFilterProp="children"
                    placeholder="Select Template"
                    loading={loadingSelects}
                    // onChange={handleTemplateChange}
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
            </Row>
          </Form>
        </Card>

        {/* <Card
          loading={loadingSpec}
          style={{ marginBottom: 16 }}
          title="Asset Specifications">
          <Row gutter={16}>
            {specs.map((spec) => {
              const name = `spec_${spec.specificationID}`;
              const label = `${spec.specificationName}${spec.unit ? ` (${spec.unit})` : ""}`;
              const rules = spec.isRequired
                ? [{ required: true, message: `Vui lòng nhập ${spec.specificationName}` }]
                : [];

              const formItem = (() => {
                switch (spec.dataType?.toLowerCase()) {
                  case "number":
                    return <Input type="number" style={{ width: "100%" }} />;
                  case "date":
                    return <DatePicker style={{ width: "100%" }} />;
                  default:
                    return <Input />;
                }
              })();

              return (
                <Col span={4} key={name}>
                  <Form.Item name={name} label={label} rules={rules}>
                    {formItem}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>

        </Card> */}

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
