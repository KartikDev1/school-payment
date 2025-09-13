import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner"; // ✅ from sonner
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster richColors position="top-right" /> {/* ✅ sonner Toaster */}
  </React.StrictMode>
);
