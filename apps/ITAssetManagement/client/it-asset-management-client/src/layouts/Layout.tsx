import React, { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
  DesktopOutlined,
  DashboardOutlined,
  ProductOutlined,
  BookOutlined,
  DeploymentUnitOutlined,
  SolutionOutlined
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
    "/assets": "2",
    "/assignments": "3",
    "/maintenance": "4",
    "/licenses": "5",
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
          icon: <DesktopOutlined />,
          label: <Link to="/assets">Assets</Link>,
        },
        {
          key: "3",
          icon: <SolutionOutlined />,
          label: <Link to="/assignments">Assign & Return</Link>,
        },
        {
          key: "4",
          icon: <DeploymentUnitOutlined />,
          label: <Link to="/maintenance">Maintenance</Link>,
        },
        {
          key: "5",
          icon: <BookOutlined />,
          label: <Link to="/licenses">Licenses</Link>,
        },
      ],
    },
  ];

  return (
    <AntLayout style={{ height: "100vh", overflow: "hidden" }}>
      {/* SIDEBAR FIXED */}
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          background: darkMode ? "#1e1e1c" : "#fff",
          zIndex: 1000,
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
          key={menuTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{
            background: darkMode ? "#1e1e1c" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <AntLayout style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* HEADER FIXED */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 250,
            right: 0,
            zIndex: 999,
            background: "#fff",
          }}
        >
          <AppHeader />
        </div>

        {/* CONTENT SCROLLABLE */}
        <Content
          style={{
            marginTop: 64, // height of AppHeader
            padding: 12,
            background: contentBg,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
