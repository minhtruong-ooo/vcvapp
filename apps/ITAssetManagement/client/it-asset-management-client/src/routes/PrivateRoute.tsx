import React from "react";
import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Spin } from "antd"; // 👈 Thêm Ant Design Spin

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );

  return keycloak.authenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
