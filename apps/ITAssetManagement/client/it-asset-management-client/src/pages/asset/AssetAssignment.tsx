import { useState, useEffect } from 'react'
import { Button, Space, Typography, Popconfirm, Table, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { useDarkMode } from "../../context/DarkModeContext";
import { useKeycloak } from "@react-keycloak/web";
import { assetAssignmentColumn } from "../../columns";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import AddAssetAssignmentModal from '../../components/modals/AddAssetAssignmentModal';

import { getAssetAssignments } from '../../api/assetAssignmentAPI';




const { Title } = Typography;

const AssetAssignment = () => {
    const { keycloak, initialized } = useKeycloak();
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [form] = Form.useForm();


    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        getAssetAssignments(keycloak.token ?? "")
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




    const handlePrint = () => {
        setPrinting(true);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPaginationState({ current: page, pageSize });
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
                <Title
                    level={3}
                    style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}
                >
                    Assignments
                </Title>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Space>
                        <Button icon={<PlusOutlined />} type="default"
                            onClick={showModal}
                        >
                            Add
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete selected assets?"
                            // onConfirm={handleDelete}
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
                columns={assetAssignmentColumn(data)}
                showSorterTooltip={{ target: "sorter-icon" }}
                rowKey={"assignmentCode"}
                loading={loading}
                onRow={(record) => ({
                    onClick: (event) => {
                        const target = event.target as HTMLElement;

                        const isCheckboxColumn = target.closest(
                            "td.ant-table-selection-column"
                        );
                        if (isCheckboxColumn) return;

                        navigate(`/assignment/${record.assignmentCode}`);
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
                scroll={{ x: "max-content", y: 650 }} // Cuộn ngang và cuộn dọc nếu cần
            />


            <Modal
                width="80vw"
                title="Add New Asset Assignment"
                open={isModalOpen}
                onCancel={handleCancel}
                centered
                destroyOnClose
                footer={null}
            >
                <AddAssetAssignmentModal
                    form={form}
                    onCancel={handleCancel}
                    onAdd={handleAddAsset}
                    onSuccess={fetchAssets}
                />
            </Modal>
        </>



    )
}

export default AssetAssignment