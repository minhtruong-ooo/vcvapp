import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { getAssets } from "../../api/assetAPI";
import { generateQrPdfUrl } from "../../api/mediaAPI";
import {
  Table,
  Button,
  Modal,
  Typography,
  message,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { assetColumn } from "../../columns";
import AddAssetModal from "../../components/modals/AddAssetModal";
import { useDarkMode } from "../../context/DarkModeContext";

const { Title } = Typography;

const Assets = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
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
  const [printing, setPrinting] = useState(false);

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
    console.log(selectedRowKeys);
    
  };

  const handlePrint = async () => {
    if (!selectedRowKeys.length) {
      message.warning("Please select at least one asset to print");
      return;
    }

    const selectedAssets = data.filter((item) =>
      selectedRowKeys.includes(item.assetTag)
    );

    setPrinting(true); // Bắt đầu loading

    const qrModels = selectedAssets.map((asset) => ({
      assetTag: asset.assetTag,
      assetName: asset.templateName,
      purchaseDate: asset.purchaseDate?.split("T")[0],
      assetURL: `${window.location.origin}/assets/${asset.assetTag}`,
    }));

    try {
      const pdfUrl = await generateQrPdfUrl(keycloak.token ?? "", qrModels);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error(error);
      message.error("Failed to print labels");
    } finally {
      setPrinting(false); // Kết thúc loading
    }
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
            <Button icon={<PlusOutlined />} type="default" onClick={showModal}>
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
            <Button
              icon={<PrinterOutlined />}
              type="default"
              disabled={selectedRowKeys.length === 0}
              onClick={handlePrint}
              loading={printing}
            >
              Print
            </Button>
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
        onRow={(record) => ({
          onClick: (event) => {
            const target = event.target as HTMLElement;

            const isCheckboxColumn = target.closest(
              "td.ant-table-selection-column"
            );
            if (isCheckboxColumn) return;

            navigate(`/assets/${record.assetTag}`);
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
        width={1400}
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
