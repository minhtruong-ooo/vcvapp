import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import Login from "../pages/Login";
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
import Assets from "../pages/asset/Assets";
import Licenses from "../pages/asset/Licenses";
import Maintenance from "../pages/asset/Maintenance";
import AssetDetailPage from "../pages/asset/AssetDetailPage";
import AssetAssignment from "../pages/asset/AssetAssignment";
import AssignmentDetailPage from "../pages/asset/AssignmentDetailPage";

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
          <Route path="/assets/:id" element={<AssetDetailPage />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/assignments" element={<AssetAssignment />} />
          <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
