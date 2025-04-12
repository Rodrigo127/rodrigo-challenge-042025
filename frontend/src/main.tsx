import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ColumnsProvider } from "./context/columns.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColumnsProvider>
      <App />
    </ColumnsProvider>
  </StrictMode>
);
