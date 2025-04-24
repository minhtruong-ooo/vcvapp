import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { getAssets } from "../../api/assetAPI";
import { Table, Button, Modal, Typography, Form, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { assetColumn } from "../../columns";
import AssetForm from "../../components/modals/AddAssetModal";

const { Title } = Typography;

const Assets = () => {
  const { keycloak, initialized } = useKeycloak();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 👈 thêm loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
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
    }
  }, [initialized, keycloak]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "16px",
          }}
        >
          <Button style={{marginRight : 8}} icon={<PlusOutlined />} type="default" onClick={showModal}>
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
      />

      <Modal
        title="Add New Asset"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        destroyOnClose
        width={1000}
      >
        <AssetForm form={form} />
      </Modal>
    </>
  );
};

export default Assets;
