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

  const siderBg = darkMode ? "#1e1e1e" : "#fff";
  const contentBg = darkMode ? "#141414" : "#fff";
  const menuTheme = darkMode ? "dark" : "light";

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{ background: siderBg }}
      >
        <div className="logo" style={{ textAlign: "center", padding: "10px 0" }}>
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
          theme={menuTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1"
            title="IT Asset Management"
            icon={<ProductOutlined />}
          >
            <Menu.Item key="2" icon={<ProjectOutlined />}>
              <Link to="/asset-templates">Asset Templates</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UnorderedListOutlined />}>
              <Link to="/assets">Asset</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
              <Link to="/maintenance">Maintenance</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<HistoryOutlined />}>
              <Link to="/asset-history">Asset History</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<BookOutlined />}>
              <Link to="/licenses">Licenses</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <AntLayout>
        <AppHeader />
        <Content
          style={{
            margin: "12px 8px",
            padding: 12,
            background: contentBg,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
