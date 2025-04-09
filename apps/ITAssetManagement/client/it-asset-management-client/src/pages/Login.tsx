import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Login: React.FC = () => {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <h2>Vui lòng đăng nhập</h2>
      <button onClick={() => keycloak.login()}>Đăng nhập</button>
    </div>
  );
};

export default Login;
