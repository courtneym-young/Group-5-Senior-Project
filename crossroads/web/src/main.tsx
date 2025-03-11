// REACT
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
// AWS AMPLIFY RESOURCES
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
// STYLING
import "./styles/index.css";
// AUTH
import { CustomAuth, formFields } from "./auth/AuthConfiguration.tsx";
import services from "./auth/CustomServices.tsx";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator services={services} formFields={formFields} components={CustomAuth}>
        <App />
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
