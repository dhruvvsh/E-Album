import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import { AppProvider } from "./components/AppContext";


createRoot(document.getElementById("root")).render(
    <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>

);