import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import { useDarkMode } from "./context/DarkModeContext";

const App: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
