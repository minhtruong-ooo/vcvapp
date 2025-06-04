import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Typography, Space, Button, Breadcrumb, Row, Col, Card, QRCode, Tag, Image, Table, message } from "antd";
import { PrinterOutlined, HomeOutlined } from "@ant-design/icons";
import { getAssignmentDetailsByCode } from "../../api/assetAssignmentAPI";
import { fetchImage, generateAssignmentPdfUrl } from "../../api/mediaAPI";
import { AssetAssignmentDto, AssetAssignmentPrintModel } from "../../interfaces/interfaces";
import logo4x4 from "../../assets/images/logo_main.png";


const { Title, Text } = Typography;
const FEURL = import.meta.env.VITE_VCV_ITAM_CLIENT_URL;

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const { keycloak } = useKeycloak();
  const token = keycloak.token;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<AssetAssignmentDto | null>(null);
  const [imageAva, setImageAva] = useState<string>();
  const [printing, setPrinting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


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

      setAssignment(assignmentDetails);

      console.log("Assignment Details:", assignmentDetails);


      if (assignmentDetails?.employeeInfomation?.[0]?.avatar) {
        const fetchAva = await fetchImage(
          token,
          assignmentDetails.employeeInfomation[0].avatar
        );
        const avatarUrl = URL.createObjectURL(fetchAva);
        setImageAva(avatarUrl);
      }

    } catch (error) {
      console.error("Error fetching assignment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
  if (!assignment) {
    message.error("Assignment data is not available.");
    return;
  }

  try {
    const token = keycloak.token;
    if (!token) {
      message.error("Authentication token not found.");
      return;
    }

    setPrinting(true);

    console.log(assignment.assignerDepartment);

    // Tạo assignmentModel theo AssetAssignmentPrintModel
    const assignmentModel: AssetAssignmentPrintModel = {
      assignmentCode: assignment.assignmentCode,
      employeeCode: assignment.employeeCode,
      employeeName: assignment.employeeName,
      departmentName: assignment.departmentName ?? "",
      assignmentBy: assignment.assignmentBy,
      assignerCode: assignment.assignerCode,
      assignerDepartment: assignment.assignerDepartment ?? "",
      assignmentByName: assignment.assignmentByName,
      assignmentDate: assignment.assignmentDate,
      assignmentAction: assignment.assignmentAction,
      notes: assignment.notes ?? "",
      assignStatus: assignment.assignStatus ?? "1",
      assetAssignments: assignment.assetAssignments ?? [],
    };

    console.log(assignmentModel);

    const pdfUrl = await generateAssignmentPdfUrl(token, assignmentModel);
    console.log("PDF URL:", pdfUrl);
    window.open(pdfUrl, "_blank"); // Mở tab mới để in
  } catch (error) {
    message.error("Failed to print assignment.");
    console.error(error);
  } finally {
    setPrinting(false);
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
            onClick={handlePrint}
            icon={<PrinterOutlined />}
          loading={printing}
          >
            Print Assignment
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={14}>
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
                  <Text strong>Receiver ID: </Text>
                  <Text>{assignment.employeeCode}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Receiver Name: </Text>
                  <Text>{assignment.employeeName}</Text>
                </div>
              </Col>
              <Col span={9}>
                <div className="asset_info">
                  <Text strong>Assigner ID: </Text>
                  <Text>{assignment.assignerCode}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assigner Name: </Text>
                  <Text>{assignment.assignmentByName}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assignment Date: </Text>
                  <Text>{assignment.assignmentDate}</Text>
                </div>
                <div className="asset_info">
                  <Text strong>Assignment Action: </Text>
                  <Tag color="#87d068">{assignment.assignmentAction}</Tag>
                </div>
                <div className="asset_info">
                  <Text strong>Note: </Text>
                  <Text>{assignment.notes}</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={10}>
          <Card
            loading={loading}
            title="Employee Information"
            style={{ height: "100%", flex: 1 }}
          >
            {assignment.employeeInfomation.length > 0 ? (
              assignment.employeeInfomation.map((employeeInfomation) => (
                <Row key={employeeInfomation.employeeCode} style={{ marginBottom: 16 }}>
                  <Col span={10}>
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <Image
                        loading="lazy"
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
                        <Text>{assignment.employeeName}</Text>
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
        </Col>

      </Row>

      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card loading={loading} title="Asset Assign" style={{ width: "100%" }}>

            <Table
              dataSource={assignment.assetAssignments}
              rowKey="detailID"
              bordered
              size="small"
              pagination={{
              pageSize,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
            }}
            >
              <Table.Column
                title="STT"
                key="stt"
                render={(text, record, index) =>
                (currentPage - 1) * pageSize + index + 1
              }
              />
              <Table.Column
                title="Asset Tag"
                dataIndex="assetTag"
                key="assetTag"
              />
              <Table.Column
                title="Asset Name"
                dataIndex="templateName"
                key="templateName"
              />
              <Table.Column
                title="Serial Number"
                dataIndex="serialNumber"
                key="serialNumber"
              />
              <Table.Column
                title="Unit"
                dataIndex="unit"
                key="unit"
              />
            </Table>
          </Card>
        </Col>
      </Row>

    </>
  )
}

export default AssignmentDetailPage