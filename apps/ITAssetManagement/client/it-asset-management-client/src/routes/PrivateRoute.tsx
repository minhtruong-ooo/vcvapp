import React from "react";
import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Spin } from "antd";
import { useDarkMode } from "../context/DarkModeContext";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { keycloak, initialized } = useKeycloak();
  const { darkMode } = useDarkMode(); // lấy trạng thái darkMode

  if (!initialized)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkMode ? "#1f1f1f" : "#fff",
        }}
      >
        <Spin size="large">
          <div style={{ minHeight: 50 }} />
        </Spin>
      </div>
    );

  return keycloak.authenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
