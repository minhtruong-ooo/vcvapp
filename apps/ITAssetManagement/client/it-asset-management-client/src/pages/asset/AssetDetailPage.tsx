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
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Asset",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Maintenance",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Assignment",
    children: "Content of Tab Pane 3",
  },
];

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
            const fetchAva = await fetchImage(token, data.assignments[0].avatar);
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

      setPrinting(true); // Bắt đầu loading

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
            type="primary"
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
      </Row >

      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset Specifications"
            style={{ width: "100%" }}
          >
            {asset.specifications.length === 0 ? (
              <Text type="secondary">No Asset Specifications available for this asset.</Text>
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




      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset Users and Licenses"
            style={{ width: "100%" }}
          >
            {asset.assignments.length === 0 && asset.licenses.length === 0 ? (
              <Text type="secondary">No Asset Users and Licenses available for this asset.</Text>
            ) : (
              <Row>
                {asset.assignments.length > 0 && (
                  <Col span={9}>
                    <Title style={{ marginBottom: "24px" }} level={5}>
                      User Information
                    </Title>
                    <Row>
                      {asset.assignments.map((assignment) => (
                        <Row key={assignment.employeeCode} style={{ marginBottom: 16 }}>
                          <Col span={8}>
                            <div
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0", // fallback nếu ảnh lỗi
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
                          <Col span={16}>
                            <div style={{ marginBottom: 8, marginLeft: 70 }}>
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
                      ))}
                    </Row>
                  </Col>
                )}

                {asset.licenses.length > 0 && (
                  <Col span={15}>
                    <Title style={{ marginBottom: "24px" }} level={5}>
                      License Information
                    </Title>
                    <Table
                      dataSource={asset.licenses}
                      rowKey="licenseKey"
                      pagination={false}
                      bordered
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
                  </Col>
                )}
              </Row>
            )}
          </Card>
        </Col>
      </Row>


      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset Information"
            style={{ width: "100%" }}
          >
            <Row gutter={16}>
              <Col span={5}>
                <Title
                  level={5}
                  style={{ marginBottom: 8, color: darkMode ? "#fff" : "#000" }}
                >
                  Asset Image
                </Title>
                {imageUrls.length > 0 ? (
                  <Image.PreviewGroup items={imageUrls}>
                    <Image
                      width="100%"
                      src={imageUrls[0]}
                      alt={asset.templateName}
                      style={{ cursor: "pointer", borderRadius: "8px" }}
                    />
                  </Image.PreviewGroup>
                ) : (
                  <Text type="secondary">No image available for this asset.</Text>
                )}
              </Col>
              <Col span={18}>
                <Title
                  level={5}
                  style={{ marginBottom: 8, color: darkMode ? "#fff" : "#000" }}
                >
                  Asset Location (Map)
                  {/* <Map2D
                    imageUrl={image}
                    marker={{ x: 82.61084407708549, y: 11.25 }}
                    onMapClick={(pos) => {
                      console.log("Clicked position:", pos);
                    }}
                  /> */}
                </Title>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            loading={loading}
            title="Asset History"
            style={{ width: "100%" }}
          >
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AssetDetailPage;
