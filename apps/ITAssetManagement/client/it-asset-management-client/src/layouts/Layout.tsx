import React, { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import { UnorderedListOutlined, DashboardOutlined, ProductOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import logo_small from '../assets/images/logo-small.png';
import AppHeader from "../layouts/AppHeader";

const { Sider, Content } = AntLayout;

const Layout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <Sider width={250} collapsible collapsed={collapsed} onCollapse={toggleCollapsed} style={{ background: "#fff", maxWidth: 500 }}>
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
                <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="sub1" title="IT Asset Management" icon={<ProductOutlined />}>
                        <Menu.Item key="2" icon={<UnorderedListOutlined />}>
                            <Link to="/assets">Asset </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>
            <AntLayout>
                <AppHeader />
                <Content style={{ margin: "12px 8px", padding: 12, background: "#fff", minHeight: 280 }}>
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;
