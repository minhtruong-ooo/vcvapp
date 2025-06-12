import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { useDarkMode } from "../../context/DarkModeContext";
import { useKeycloak } from "@react-keycloak/web";
import { getAssetTemplates, updateAssetTemplate, deleteAssetTemplates } from "../../api/assetAPI";
import {
  Table,
  Button,
  Drawer,
  Input,
  Typography,
  message,
  Space,
  Popconfirm,
  InputNumber,
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { assetTemplateColumn } from "../../columns";
import AddAssetTemplateModal from "../../components/modals/AddAssetTemplateModal";


const { Title } = Typography;

const AssetTemplates = () => {
  const [form] = Form.useForm();
  const { darkMode } = useDarkMode();
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak?.token ?? "";
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginationState, setPaginationState] = useState({
    current: 1,
    pageSize: 15,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const showModal = () => setIsModalOpen(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationState({ current: page, pageSize });
  };


  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      fetchAssetTemplates();
    }
  }, [initialized, keycloak]);


  const fetchAssetTemplates = () => {
    setLoading(true);
    getAssetTemplates(keycloak.token ?? "")
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        message.error("Error fetching assets: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

const handleDelete = async () => {
  try {
    const result = await deleteAssetTemplates(token, selectedRowKeys.map(Number));
    message.success(result.message); // "Đã xoá 3 bản ghi"
    fetchAssetTemplates(); // Refresh data after deletion
    setSelectedRowKeys([]); // Clear selected keys after deletion
  } catch (err: any) {
    message.error(err.message);
  }
}

const handleAddAsset = (newAsset: any) => {
}


  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Title
          level={3}
          style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}
        >
          Asset Templates
        </Title>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Space>
            <Button icon={<PlusOutlined />} type="default" onClick={showModal}>
              Add
            </Button>
            <Popconfirm
              title="Are you sure to delete selected asset templates?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                icon={<DeleteOutlined />}
                type="default"
                danger
                disabled={selectedRowKeys.length === 0}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>

      <Table
        key={darkMode ? "dark" : "light"}
        size="middle"
        bordered
        dataSource={data}
        columns={assetTemplateColumn(data)}
        showSorterTooltip={{ target: "sorter-icon" }}
        rowKey={"templateID"}
        loading={loading}
        onRow={(record) => ({
          onClick: () => {

            setSelectedRecord(record);
            form.setFieldsValue(record); // Đổ dữ liệu vào form
            setIsDrawerOpen(true);
          },
        })}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          current: paginationState.current, // Trang hiện tại từ state
          pageSize: paginationState.pageSize, // Số lượng hàng trên mỗi trang từ state
          pageSizeOptions: ["15", "25", "50"], // Các tùy chọn số lượng hàng trên mỗi trang
          total: data.length, // Tổng số bản ghi
          showSizeChanger: true, // Cho phép thay đổi số lượng hàng trên mỗi trang
          onChange: handlePaginationChange, // Cập nhật state khi thay đổi trang
          showTotal: (total) => `Total: ${total} item`, // Hiển thị tổng số mục
          position: ["bottomRight"], // Cố định phân trang ở dưới
          hideOnSinglePage: true, // Ẩn phân trang nếu chỉ có một trang
          style: {
            color: darkMode ? "#fff" : "#000",
          },
        }}
        scroll={{ x: "max-content", y: 650 }}
      />

      <Drawer
        title="Edit Asset Template"
        width={500}
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
          setSelectedRecord(null);
        }}
        open={isDrawerOpen}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            console.log("Updated values:", values);
            updateAssetTemplate(token, values)
              .then(() => {
                message.success("Asset template updated successfully");
                setIsDrawerOpen(false);
                form.resetFields();
                setSelectedRecord(null);
                fetchAssetTemplates(); // Refresh data after update
              })
              .catch((error) => {
                message.error("Error updating asset template: " + error.message);
              });
          }}
        >
          <Form.Item name="templateID" label="Template ID">
            <Input disabled={!!selectedRecord} />
          </Form.Item>
          <Form.Item name="templateName" label="Template Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="defaultWarrantyMonths" label="Warranty Months">
            <InputNumber  type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        style={{
          backgroundColor: darkMode ? "#1f1f1f" : "#fff",
          color: darkMode ? "#fff" : "#000",
          borderRadius: "5px",
        }}
        title="Add New Asset Template"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        destroyOnClose
        width={900}
        footer={null}
      >
        <AddAssetTemplateModal
          form={form}
          onCancel={handleCancel}
          onAdd={handleAddAsset}
          onSuccess={fetchAssetTemplates}
        />
      </Modal>


    </>
  )
}

export default AssetTemplates