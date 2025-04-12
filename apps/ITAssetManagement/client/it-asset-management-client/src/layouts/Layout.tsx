import React, { useState } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
    UnorderedListOutlined,
    DashboardOutlined,
    ProductOutlined,
    BookOutlined,
    HistoryOutlined,
    DeploymentUnitOutlined
} from "@ant-design/icons";
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from '../assets/images/logo.png';
import logo_small from '../assets/images/logo-small.png';
import AppHeader from "../layouts/AppHeader";

const { Sider, Content } = AntLayout;

const Layout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const location = useLocation();

    // Ánh xạ đường dẫn đến key Menu tương ứng
    const menuKeyMap: { [key: string]: string } = {
        "/dashboard": "1",
        "/assets": "2",
        "/maintenance": "3",
        "/asset-history": "4",
        "/licenses": "5",
        // Thêm các đường dẫn khác nếu cần
    };

    const selectedKey = menuKeyMap[location.pathname] || "1";

    // Nếu bạn muốn mở SubMenu tương ứng, bạn có thể xác định openKeys
    // Ví dụ, nếu các mục nằm trong SubMenu với key "sub1":
    const openKeys = ["sub1"]; // Giữ SubMenu mở

    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <Sider
                width={250}
                collapsible
                collapsed={collapsed}
                onCollapse={toggleCollapsed}
                style={{ background: "#fff", maxWidth: 500 }}
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
                    theme="light"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    defaultOpenKeys={openKeys} // Mở SubMenu nếu cần
                >
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="sub1" title="IT Asset Management" icon={<ProductOutlined />}>
                        <Menu.Item key="2" icon={<UnorderedListOutlined />}>
                            <Link to="/assets">Asset</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<DeploymentUnitOutlined />}>
                            <Link to="/maintenance">Maintenance</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<HistoryOutlined />}>
                            <Link to="/asset-history">Asset History</Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<BookOutlined />}>
                            <Link to="/licenses">Licenses</Link>
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