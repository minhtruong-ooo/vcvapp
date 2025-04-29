import React, { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
  UnorderedListOutlined,
  DashboardOutlined,
  ProductOutlined,
  BookOutlined,
  HistoryOutlined,
  DeploymentUnitOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import logo_small from "../assets/images/logo-small.png";
import AppHeader from "../layouts/AppHeader";
import { useDarkMode } from "../context/DarkModeContext";

const { Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const { darkMode } = useDarkMode(); // lấy trạng thái darkMode

  const location = useLocation();

  const menuKeyMap: { [key: string]: string } = {
    "/dashboard": "1",
    "/asset-templates": "2",
    "/assets": "3",
    "/maintenance": "4",
    "/asset-history": "5",
    "/licenses": "6",
  };

  const selectedKey = menuKeyMap[location.pathname] || "1";
  const openKeys = ["sub1"];

  const contentBg = darkMode ? "#141414" : "#fff";
  const menuTheme = darkMode ? "dark" : "light";

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "sub1",
      icon: <ProductOutlined />,
      label: "IT Asset Management",
      children: [
        {
          key: "2",
          icon: <ProjectOutlined />,
          label: <Link to="/asset-templates">Asset Templates</Link>,
        },
        {
          key: "3",
          icon: <UnorderedListOutlined />,
          label: <Link to="/assets">Assets</Link>,
        },
        {
          key: "4",
          icon: <DeploymentUnitOutlined />,
          label: <Link to="/maintenance">Maintenance</Link>,
        },
        {
          key: "5",
          icon: <HistoryOutlined />,
          label: <Link to="/asset-history">Asset History</Link>,
        },
        {
          key: "6",
          icon: <BookOutlined />,
          label: <Link to="/licenses">Licenses</Link>,
        },
      ],
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          background: darkMode ? "#1e1e1c" : "#fff", // Dark background for dark mode
          color: darkMode ? "#fff" : "#000", // Adjust text color for dark mode
        }}
      >
        <div
          className="logo"
          style={{ textAlign: "center", padding: "10px 0" }}
        >
          <img
            src={collapsed ? logo_small : logo}
            alt="Logo"
            style={{
              width: collapsed ? "60px" : "190px",
              transition: "all 0.3s ease",
            }}
          />
        </div>
        <Menu
          key={menuTheme} // Add this
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{
            background: darkMode ? "#1e1e1c" : "#fff", // Dark background for dark mode
            color: darkMode ? "#fff" : "#000", // Adjust text color for dark mode
          }}
        />
      </Sider>
      <AntLayout>
        <AppHeader />
        <Content
          style={{
            padding: 12,
            background: contentBg,
            minHeight: 280,
            color: darkMode ? "#fff" : "#000", // thêm dòng này
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
