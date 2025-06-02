import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useDarkMode } from "../../context/DarkModeContext";
import { Typography, Space, Button, Breadcrumb } from "antd";
import { PrinterOutlined, HomeOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;

const AssignmentDetailPage = () => {
      const { keycloak } = useKeycloak();
      const { darkMode } = useDarkMode();
    
      const { id } = useParams();
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
                // title: <strong>{asset.templateName}</strong>,
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
            Print Label
          </Button>
        </Space>
      </div>
    </>
  )
}

export default AssignmentDetailPage