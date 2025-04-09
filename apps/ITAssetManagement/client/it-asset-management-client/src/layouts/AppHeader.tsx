import React from "react";
import { Layout, Dropdown, Space, Avatar } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { DownOutlined, LogoutOutlined, ProfileOutlined, UserOutlined  } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { keycloak } = useKeycloak();
  // console.log(keycloak.tokenParsed);

  // Xử lý sự kiện khi người dùng click vào các mục dropdown
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "2") {
      keycloak.logout();
    }
  };

  // Menu item
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
      icon: <ProfileOutlined />
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 20px",
      }}
      
    >
      <Dropdown menu={{ items, onClick: handleMenuClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
          <Avatar size={32} icon={<UserOutlined />} />
            Welcome, {keycloak.tokenParsed?.name ! || "Người dùng"}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
