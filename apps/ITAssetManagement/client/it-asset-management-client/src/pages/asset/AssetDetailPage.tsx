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
} from "antd";
import type { TabsProps } from "antd";
import { PrinterOutlined, HomeOutlined } from "@ant-design/icons";
import { useDarkMode } from "../../context/DarkModeContext";
import { Map2D } from "../../components/Map2D";
import image from "../../assets/images/1F2F.png";

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
                href: "/assets",
                title: "Assets",
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
                  icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                />
              </Col>
              <Col span={7}>
                <Text className="asset_info" strong>
                  Asset ID:{" "}
                </Text>
                <Text className="asset_info">{asset.assetID}</Text>
                <br />
                <Text className="asset_info" strong>
                  Asset Tag:{" "}
                </Text>
                <Text className="asset_info">{asset.assetTag}</Text>
                <br />
                <Text className="asset_info" strong>
                  Asset Type:{" "}
                </Text>
                <Text className="asset_info">{asset.typeName}</Text>
                <br />
                <Text className="asset_info" strong>
                  Asset Name:{" "}
                </Text>
                <Text className="asset_info">{asset.templateName}</Text>
              </Col>
              <Col span={5}>
                <Text className="asset_info" strong>
                  Manufacturer:{" "}
                </Text>
                <Tag color="#b73939">{asset.manufacturer}</Tag>
                <br />
                <Text className="asset_info" strong>
                  Model:{" "}
                </Text>
                <Text className="asset_info">{asset.model}</Text>
                <br />
                <Text className="asset_info" strong>
                  Serial Number:{" "}
                </Text>
                <Text className="asset_info">{asset.serialNumber}</Text>
                <br />
              </Col>
              <Col span={4}>
                <Text className="asset_info" strong>
                  Status:{" "}
                </Text>
                <Tag color="#87d068">{asset.statusName}</Tag>
                <br />
                <Text className="asset_info" strong>
                  Location:{" "}
                </Text>
                <Text className="asset_info">{asset.locationName}</Text>
                <br />
              </Col>
              <Col span={5}>
                <Text className="asset_info" strong>
                  Purchase Date:{" "}
                </Text>
                <Text className="asset_info">{asset.purchaseDate}</Text>
                <br />
                <Text className="asset_info" strong>
                  Warranty Expiry:{" "}
                </Text>
                <Text className="asset_info">{asset.warrantyExpiry}</Text>
                <br />
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
                      style={{ cursor: "pointer" }}
                    />
                  </Image.PreviewGroup>
                ) : (
                  <Text>No image available for this asset.</Text>
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
