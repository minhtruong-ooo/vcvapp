// Assets.tsx
import { useEffect, useState } from "react";
import { Form } from 'antd';
import { useKeycloak } from "@react-keycloak/web";
import { getAssets } from "../../api/assetAPI";
import { Table, Button, Modal, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { assetColumn } from "../../columns";
import AddAssetModal from "../../components/modals/AddAssetModal"; // đúng tên

const { Title } = Typography;

const Assets = () => {
  const { keycloak, initialized } = useKeycloak();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Assets
        </Title>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            style={{ marginRight: 8 }}
            icon={<PlusOutlined />}
            type="default"
            onClick={showModal}
          >
            Add
          </Button>
          <Button icon={<DeleteOutlined />} type="default" danger>
            Delete
          </Button>
        </div>
      </div>

      <Table
        size="small"
        dataSource={data}
        columns={assetColumn(data)}
        showSorterTooltip={{ target: "sorter-icon" }}
        rowKey={"assetTag"}
        loading={loading}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            console.log("Selected Row Keys:", selectedRowKeys);
            console.log("Selected Rows:", selectedRows);
          },
        }}
      />

      <Modal
        title="Add New Asset"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        destroyOnClose
        width={1200}
        footer={null}
      >
        <AddAssetModal form={form} onCancel={handleCancel} onAdd={handleAddAsset} />
      </Modal>
    </>
  );
};

export default Assets;
