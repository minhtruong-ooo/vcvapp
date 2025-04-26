import React from "react";
import {
  Layout,
  Dropdown,
  Space,
  Avatar,
  // Switch,
} from "antd";
import { useKeycloak } from "@react-keycloak/web";
import {
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useDarkMode } from "../context/DarkModeContext"
const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { keycloak } = useKeycloak();
  const { darkMode } = useDarkMode();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
      icon: <ProfileOutlined />,
    },
    {
      type: "divider",
    },
    // {
    //   key: "darkmode",
    //   label: (
    //     <Space>
    //       Dark Mode
    //       <Switch size="small" checked={darkMode} onChange={toggleDarkMode} />
    //     </Space>
    //   ),
    //   disabled: true,
    // },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "2") {
      keycloak.logout();
    }
  };

  return (
    <Header
      style={{
        background: darkMode ? "#141414" : "#fff",
        color: darkMode ? "#fff" : "#000",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 25px",
      }}
    >
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ color: darkMode ? "#fff" : "#000" }}>
            <Avatar size={32} icon={<UserOutlined />} />
            Welcome, {keycloak.tokenParsed?.name || "Người dùng"}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
