import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { MqttProvider } from "./contexts/MqttContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MqttProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MqttProvider>
  </StrictMode>,
);
