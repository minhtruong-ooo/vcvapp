import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Typography, Space, Button, Breadcrumb, Row, Col, Card, QRCode } from "antd";
import { PrinterOutlined, HomeOutlined } from "@ant-design/icons";
import { getAssignmentDetailsByCode } from "../../api/assetAssignmentAPI";
import { AssetAssignmentDto } from "../../interfaces/interfaces";
import logo4x4 from "../../assets/images/logo_main.png";


const { Title, Text } = Typography;
const FEURL = import.meta.env.VITE_VCV_ITAM_CLIENT_URL;

const AssignmentDetailPage = () => {
  const { keycloak } = useKeycloak();
  const token = keycloak.token;

  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [assignment, setAssignment] = useState<AssetAssignmentDto | null>(null);

  const { id } = useParams();

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id, token]);

  const fetchAssignmentDetails = async () => {
    if (!id || !token) return;
    try {
      setLoading(true);
      const assignmentDetails = await getAssignmentDetailsByCode(
        token,
        id
      );
      console.log("Assignment Details:", assignmentDetails);
      setAssignment(assignmentDetails);
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <p>No assignment found.</p>;

  return (
    <>
      <div>
        <Space>
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Assignment Detail
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
                title: <a href="/assignments">Assignment</a>,
              },
              {
                title: <strong>{id}</strong>,
              },
            ]}
          />
        </Space>
        <Space>
          <Button
            // onClick={handlePrint}
            icon={<PrinterOutlined />}
          // loading={printing}
          >
            Print Assignment
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            loading={loading}
            title="General Information"
            style={{ width: "100%" }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <QRCode
                  errorLevel="H"
                  value={FEURL + "/assignment/" + assignment.assignmentCode}
                  icon={logo4x4}
                />
              </Col>
              <Col span={9}>
                <div className="asset_info">
                  <Text strong>Assignment ID: </Text>
                  <Text>{assignment.assignmentID}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assignment Code: </Text>
                  <Text>{assignment.assignmentCode}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Receiver Name: </Text>
                  <Text>{assignment.employeeName}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assigner Name: </Text>
                  <Text>{assignment.assignmentBy}</Text>
                </div>
              </Col>
              <Col span={9}>
                <div className="asset_info">
                  <Text strong>Assignment ID: </Text>
                  <Text>{assignment.assignmentID}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assignment Code: </Text>
                  <Text>{assignment.assignmentCode}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Receiver Name: </Text>
                  <Text>{assignment.employeeName}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assigner Name: </Text>
                  <Text>{assignment.assignmentBy}</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>  
      </Row>
    </>
  )
}

export default AssignmentDetailPage