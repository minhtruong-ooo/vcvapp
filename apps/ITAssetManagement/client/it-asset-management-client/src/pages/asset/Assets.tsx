// Assets.tsx
import { useEffect, useState } from "react";
import { Form } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { getAssets } from "../../api/assetAPI";
import {
  Table,
  Button,
  Modal,
  Typography,
  message,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { assetColumn } from "../../columns";
import AddAssetModal from "../../components/modals/AddAssetModal";
import { useDarkMode } from "../../context/DarkModeContext";

const { Title } = Typography;

const Assets = () => {
  const { darkMode } = useDarkMode();
  const { keycloak, initialized } = useKeycloak();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [paginationState, setPaginationState] = useState({
    current: 1,
    pageSize: 15,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Load dữ liệu khi auth sẵn sàng
  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      fetchAssets();
    }
  }, [initialized, keycloak]);

  const fetchAssets = () => {
    setLoading(true);
    getAssets(keycloak.token ?? "")
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

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAddAsset = (newAsset: any) => {
    setData([...data, newAsset]); // Add the new asset to the data state
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationState({ current: page, pageSize });
  };

  const handleDelete = () => {
    // Ví dụ: gọi API xóa theo assetTag hoặc key

    console.log(selectedRowKeys); // Xóa các asset đã chọn
    // Promise.all(
    //   selectedRowKeys.map((key) =>
    //     deleteAssetById(key, keycloak.token ?? "") // bạn cần implement `deleteAssetById`
    //   )
    // )
    //   .then(() => {
    //     message.success("Deleted successfully");
    //     fetchAssets(); // Refresh data
    //     setSelectedRowKeys([]); // Clear selection
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     message.error("Failed to delete selected assets");
    //   });
  };

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
          Assets
        </Title>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Space>
            <Button
              style={{
                backgroundColor: darkMode ? "#2a2a2a" : undefined,
                color: darkMode ? "#fff" : undefined,
              }}
              icon={<PlusOutlined />}
              type="default"
              onClick={showModal}
            >
              Add
            </Button>
            <Popconfirm
              title="Are you sure to delete selected assets?"
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
        columns={assetColumn(data)}
        showSorterTooltip={{ target: "sorter-icon" }}
        rowKey={"assetTag"}
        loading={loading}
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
        scroll={{ x: "max-content", y: 650 }} // Cuộn ngang và cuộn dọc nếu cần
      />

      <Modal
        style={{
          backgroundColor: darkMode ? "#1f1f1f" : "#fff",
          color: darkMode ? "#fff" : "#000",
          borderRadius: "5px",
        }}
        title="Add New Asset"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        destroyOnClose
        width={1200}
        footer={null}
      >
        <AddAssetModal
          form={form}
          onCancel={handleCancel}
          onAdd={handleAddAsset}
          onSuccess={fetchAssets}
        />
      </Modal>
    </>
  );
};

export default Assets;
