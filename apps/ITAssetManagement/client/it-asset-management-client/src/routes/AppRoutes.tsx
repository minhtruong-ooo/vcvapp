import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import Login from "../pages/Login";
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
import Assets from "../pages/asset/Assets";
import AssetHistory from "../pages/asset/AssetHistory";
import Licenses from "../pages/asset/Licenses";
import Maintenance from "../pages/asset/Maintenance";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Đường dẫn đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Các trang cần layout chung được bọc trong PrivateRoute và Layout */}
        <Route element={<PrivateRoute element={<Layout />} />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/asset-history" element={<AssetHistory />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
