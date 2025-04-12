// Assets.tsx (đối với API asset)
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { getAssets } from '../../api/assetAPI';
import { Table, Button, Modal, Typography, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { defaultColumns } from '../../columns';  // Sử dụng các cột chung
import { formatAssetData } from '../../utils';  // Sử dụng hàm chung xử lý dữ liệu
import AssetForm from '../../components/modals/AddAssetModal';

const { Title } = Typography;

const Assets = () => {
  const { keycloak, initialized } = useKeycloak();
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      getAssets(keycloak.token ?? '')
        .then((responseData) => {
          const apiData = formatAssetData(responseData);
          setData(apiData);
        })
        .catch((error) => {
          console.error('Failed to fetch assets', error);
        });
    }
  }, [initialized, keycloak]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>Assets</Title>
        <Button icon={<PlusOutlined />} type="default" onClick={showModal}>Add</Button>
      </div>

      <Table dataSource={data} columns={defaultColumns} />

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
