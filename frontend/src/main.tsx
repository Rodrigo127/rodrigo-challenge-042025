import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ColumnsProvider } from "./context/columns.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apollo-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ColumnsProvider>
        <App />
      </ColumnsProvider>
    </ApolloProvider>
  </StrictMode>
);
