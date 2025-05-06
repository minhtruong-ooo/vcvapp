import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Asset } from "../../interfaces/interfaces";
import { QRModel } from "../../interfaces/QRCode";
import { getAssetDetail } from "../../api/assetAPI";
import { fetchImage, generateQrPdfUrl } from "../../api/mediaAPI";
import {
  message,
  Typography,
  Row,
  Col,
  Space,
  Breadcrumb,
  Card,
  QRCode,
  Image,
  Tag,
  Tabs,
  Button,
  Table,
} from "antd";
import type { TabsProps } from "antd";
import { PrinterOutlined, HomeOutlined } from "@ant-design/icons";
import { useDarkMode } from "../../context/DarkModeContext";
import { Map2D } from "../../components/Map2D";
import image from "../../assets/images/1F2F.png";
import logo4x4 from "../../assets/images/logo_main.png";

const { Title, Text } = Typography;

const AssetDetailPage = () => {
  const { keycloak } = useKeycloak();
  const { darkMode } = useDarkMode();

  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [printing, setPrinting] = useState(false);
  const [imageAva, setImageAva] = useState<string>();

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const token = keycloak.token;
        if (!token) {
          message.error("Authentication token not found.");
          return;
        }

        if (!id) {
          message.error("Asset ID is missing in URL.");
          return;
        }

        const data = await getAssetDetail(token, id);
        setAsset(data);

        if (data?.images && data.images.length > 0) {
          const urls: string[] = [];

          for (const img of data.images) {
            try {
              const blob = await fetchImage(token, img.imageUrl);
              const objectUrl = URL.createObjectURL(blob);
              urls.push(objectUrl);
            } catch (err) {
              console.error("Failed to fetch image", img.imageUrl, err);
            }
          }
          setImageUrls(urls);

          if (data?.assignments?.[0]?.avatar) {
            const fetchAva = await fetchImage(
              token,
              data.assignments[0].avatar
            );
            const avatarUrl = URL.createObjectURL(fetchAva);
            setImageAva(avatarUrl);
          }
        }
      } catch (error: any) {
        message.error("Failed to load asset detail: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, keycloak.token]);

  const handlePrint = async () => {
    if (!asset) {
      message.error("Asset data is not available.");
      return;
    }

    try {
      const token = keycloak.token;
      if (!token) {
        message.error("Authentication token not found.");
        return;
      }

      setPrinting(true);

      const qrModel: QRModel = {
        assetTag: asset.assetTag,
        assetName: asset.templateName || "Unknown Asset",
        purchaseDate: asset.purchaseDate || undefined,
        assetURL: `http://localhost:5173/assets/${asset.assetTag}`,
      };

      const pdfUrl = await generateQrPdfUrl(token, [qrModel]);
      console.log("PDF URL:", pdfUrl);
      window.open(pdfUrl, "_blank"); // Mở tab mới
    } catch (error) {
      message.error("Failed to print label.");
      console.error(error);
    } finally {
      setPrinting(false); // Kết thúc loading
    }
  };

  if (!asset) return <p>No asset found.</p>;

  return (
    <>
      <div>
        <Space>
          <Title
            level={3}
            style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}
          >
            Asset Detail
          </Title>
        </Space>
      </div>

      <div
        style={{
          margin: "16px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Breadcrumb
            items={[
              {
                title: <HomeOutlined />,
              },
              {
                title: <a href="/assets">Assets</a>,
              },
              {
                title: <strong>{asset.templateName}</strong>,
              },
            ]}
          />
        </Space>

        <Space>
          <Button
            onClick={handlePrint}
            icon={<PrinterOutlined />}
            loading={printing}
          >
            Print Label
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            loading={loading}
            title="General Information"
            style={{ width: "100%" }}
          >
            <Row gutter={16}>
              <Col span={3}>
                <QRCode
                  errorLevel="H"
                  value={`http://localhost:5173/assets/${asset.assetTag}`}
                  icon={logo4x4}
                />
              </Col>
              <Col span={7}>
                <div className="asset_info">
                  <Text strong>Asset ID: </Text>
                  <Text>{asset.assetID}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Asset Tag: </Text>
                  <Text>{asset.assetTag}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Asset Type: </Text>
                  <Text>{asset.typeName}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Asset Name: </Text>
                  <Text>{asset.templateName}</Text>
                </div>
              </Col>
              <Col span={5}>
                <div className="asset_info">
                  <Text strong>Manufacturer: </Text>
                  <Tag color="#b73939">{asset.manufacturer}</Tag>
                </div>
                <div className="asset_info">
                  <Text strong>Model: </Text>
                  <Text>{asset.model}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Serial Number: </Text>
                  <Text>{asset.serialNumber}</Text>
                </div>
              </Col>
              <Col span={4}>
                <div className="asset_info">
                  <Text strong>Status: </Text>
                  <Tag color="#87d068">{asset.statusName}</Tag>
                </div>
                <div className="asset_info">
                  <Text strong>Location: </Text>
                  <Text>{asset.locationName}</Text>
                </div>
              </Col>
              <Col span={5}>
                <div className="asset_info">
                  <Text strong>Purchase Date: </Text>
                  <Text>{asset.purchaseDate}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Warranty Expiry: </Text>
                  <Text>{asset.warrantyExpiry}</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset Specifications"
            style={{ width: "100%" }}
          >
            {asset.specifications.length === 0 ? (
              <Text type="secondary">
                No asset specifications available for this asset.
              </Text>
            ) : (
              <Row gutter={[16, 16]}>
                {asset.specifications.map((spec) => (
                  <Col key={spec.specificationID} span={12} md={12} lg={4}>
                    <div
                      style={{
                        border: "1px solid #eee",
                        borderRadius: 4,
                        padding: 12,
                      }}
                    >
                      <div style={{ fontWeight: "bold", textAlign: "center" }}>
                        {spec.specificationName}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        {spec.value}
                        {spec.unit ? ` ${spec.unit}` : ""}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "16px", display: "flex" }}>
        <Col span={10}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Card
              loading={loading}
              title="Asset User"
              style={{ height: "100%", flex: 1 }}
            >
                {asset.assignments.length > 0 ? (
                asset.assignments.map((assignment) => (
                  <Row key={assignment.employeeCode} style={{ marginBottom: 16 }}>
                  <Col span={10}>
                    <div
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                    }}
                    >
                    <Image
                      preview={false}
                      src={imageAva || ""}
                      style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      }}
                    />
                    </div>
                  </Col>
                  <Col span={10}>
                    <div style={{ marginBottom: 8 }}>
                    <div className="assign_user_info">
                      <Text strong>Employee ID: </Text>
                      <Text>{assignment.employeeCode}</Text>
                    </div>
                    <div className="assign_user_info">
                      <Text strong>Full Name: </Text>
                      <Text>{assignment.fullName}</Text>
                    </div>
                    <div className="assign_user_info">
                      <Text strong>Department: </Text>
                      <Text>{assignment.departmentName}</Text>
                    </div>
                    <div className="assign_user_info">
                      <a>View User</a>
                    </div>
                    </div>
                  </Col>
                  </Row>
                ))
                ) : (
                <Text type="secondary">No users are using this asset.</Text>
                )}
            </Card>
          </div>
        </Col>
        <Col span={14}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Card
              loading={loading}
              title="Asset Images"
              style={{ height: "100%", flex: 1 }}
            >
              {imageUrls.length > 0 ? (
                <Image.PreviewGroup items={imageUrls}>
                  <Row gutter={[16, 16]}>
                    {imageUrls.map((url, index) => (
                      <Col key={index} span={8} md={8} lg={6}>
                        <Image
                          src={url}
                          alt={asset.templateName}
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              ) : (
                <Text type="secondary">No image available for this asset.</Text>
              )}
            </Card>
          </div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset Location (Map)"
            style={{ width: "100%" }}
          >
            <Map2D
              imageUrl={image}
              marker={{ x: 64.51204055766794, y: 20 }}
              onMapClick={(pos) => {
                console.log("Clicked position:", pos);
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Licenses Attached To Asset"
            style={{ width: "100%" }}
          >
            {asset.licenses.length > 0 ? (
              <Table
                dataSource={asset.licenses}
                rowKey="licenseKey"
                bordered
                size="small"
              >
                <Table.Column
                  title="Software Name"
                  dataIndex="softwareName"
                  key="softwareName"
                />
                <Table.Column
                  title="License Key"
                  dataIndex="licenseKey"
                  key="licenseKey"
                />
                <Table.Column
                  title="License Type"
                  dataIndex="licenseType"
                  key="licenseType"
                  render={(licenseType) => (
                    <Tag color="#87d068">{licenseType}</Tag>
                  )}
                />
                <Table.Column
                  title="Purchase Date"
                  dataIndex="purchaseDate"
                  key="purchaseDate"
                />
                <Table.Column
                  title="Expiry Date"
                  dataIndex="expiryDate"
                  key="expiryDate"
                />
                <Table.Column
                  title="Assigned By"
                  dataIndex="assignedBy"
                  key="assignedBy"
                />
              </Table>
            ) : (
              <Text type="secondary">No license available for this asset.</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card loading={loading} title="Asset History" style={{ width: "100%" }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: "History",
                  children: asset.history.length > 0 ? (
                    <Table
                      dataSource={asset.history}
                      rowKey="historyID"
                      bordered
                      size="small"
                    >
                      <Table.Column
                        title="Action Type"
                        dataIndex="actionType"
                        key="actionType"
                        render={(actionType) => (
                          <Tag color="#84d068">{actionType}</Tag>
                        )}
                      />
                      <Table.Column
                        title="Change Date"
                        dataIndex="changeDate"
                        key="changeDate"
                      />
                      <Table.Column
                        title="Changed By"
                        dataIndex="changedBy"
                        key="changedBy"
                      />
                      <Table.Column
                        title="Field Changed"
                        dataIndex="fieldChanged"
                        key="fieldChanged"
                      />
                      <Table.Column
                        title="Old Value"
                        dataIndex="oldValue"
                        key="oldValue"
                      />
                      <Table.Column
                        title="New Value"
                        dataIndex="newValue"
                        key="newValue"
                      />
                      <Table.Column
                        title="Note"
                        dataIndex="note"
                        key="note"
                      />
                    </Table>
                  ) : (
                    <Text type="secondary">No asset history.</Text>
                  ),
                },
                // Bạn có thể thêm các tab khác ở đây
                // {
                //   key: "2",
                //   label: "Other Tab",
                //   children: <div>Other content</div>,
                // },
              ]}
            />
          </Card>
        </Col>
      </Row>

    </>
  );
};

export default AssetDetailPage;
