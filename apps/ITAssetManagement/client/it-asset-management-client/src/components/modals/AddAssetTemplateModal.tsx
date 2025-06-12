import { useState, useEffect } from "react";
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Button,
    message,
    Card
} from "antd";
import type { FormInstance } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import {
    createAssetTemplate,
    getAssetType
} from "../../api/assetAPI";



const AddAssetTemplateModal = ({
    form,
    onCancel,
    onSuccess,
}: {
    form: FormInstance;
    onCancel: () => void;
    onAdd: (newAssetTemplate: any) => void;
    onSuccess: () => void;
}) => {
    const { keycloak } = useKeycloak();
    const token = keycloak?.token;
    const [loading, setLoading] = useState(false);
    const [loadingSelects, setLoadingSelects] = useState(true);
    const [assetType, setAssetType] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        if (!token) {
            message.error("You are not authenticated. Please login again.");
            return;
        }
        try {
            setLoadingSelects(true);
            const assetTypes = await getAssetType(token);
            setAssetType(assetTypes);
        }
        catch (error) {
            message.error("Error fetching data: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoadingSelects(false);
        }
    }



    const handleSave = async () => {
        try {
            setLoading(true);

            if (!token) {
                message.error("You are not authenticated. Please login again.");
                return;
            }

            const values = await form.validateFields();
            const newAssetTemplate = {
                assetTypeID: values.assetTypeID,
                templateName: values.templateName,
                model: values.model,
                manufacturer: values.manufacturer,
                defaultWarrantyMonths: values.defaultWarrantyMonths,
                unit: values.unit
            };
            await createAssetTemplate(token, newAssetTemplate);
            message.success("Asset template created successfully.");
            onSuccess();
            form.resetFields();
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



    return (
        <>
            <Form form={form} layout="vertical" name="assetForm">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Asset Type"
                                name="assetTypeID"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="Select Asset Type"
                                    loading={loadingSelects}
                                >
                                    {assetType.map((assetType) => (
                                        <Select.Option
                                            key={assetType.assetTypeID}
                                            value={assetType.assetTypeID}
                                        >
                                            {assetType.typeName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Template Name"
                                name="templateName"
                                rules={[{ required: true, message: "Please input the template name!" }]}
                            >
                                <Input placeholder="Enter Template Name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Model"
                                name="model"
                                rules={[{ required: true, message: "Please input the model!" }]}
                            >
                                <Input placeholder="Enter Model" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Manufacturer"
                                name="manufacturer"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Manufacturer" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Warranty Months"
                                name="defaultWarrantyMonths"
                                rules={[{ required: true, message: "Please input the warranty months!" }]}
                            >
                                <Input min={0} type="number" placeholder="Enter Warranty Months" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Unit"
                                name="unit"
                                rules={[{ required: true, message: "Please input the unit!" }]}
                            >
                                <Input placeholder="Enter Unit" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

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

export default AddAssetTemplateModal