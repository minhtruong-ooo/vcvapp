// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import Login from "../pages/Login";
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Đường dẫn đăng nhập */}
        <Route path="/login" element={<Login />} />
        
        {/* Các trang cần layout chung được bọc trong PrivateRoute và Layout */}
        <Route element={<PrivateRoute element={<Layout />} />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
