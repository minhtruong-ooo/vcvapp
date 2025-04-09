import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./config/keycloak";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false,
    }}
  >
    <App />
  </ReactKeycloakProvider>
);
