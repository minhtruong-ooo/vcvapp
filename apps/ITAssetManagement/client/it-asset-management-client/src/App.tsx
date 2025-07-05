import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import "antd/dist/reset.css";
import { useDarkMode } from "./context/DarkModeContext";
import useTokenAutoRefresh from "./hooks/useTokenAutoRefresh";

const App: React.FC = () => {
  const { darkMode } = useDarkMode();
  useTokenAutoRefresh();

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AppRoutes />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
