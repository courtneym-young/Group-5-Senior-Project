import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import "./styles/index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { CustomAuth, formFields } from "./auth/AuthConfiguration.tsx";
import services from "./auth/CustomServices.tsx";
import { BrowserRouter } from "react-router";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator services={services} formFields={formFields} components={CustomAuth} hideSignUp>
        <App />
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
