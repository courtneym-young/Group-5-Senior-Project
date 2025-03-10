import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import App.tsx
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";

// Material-UI Theme (Optional)
const theme = createTheme({
  palette: {
    primary: { main: "#4caf50" }, // Green theme matching Figma mockup
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App /> {/* No BrowserRouter here! */}
    </ThemeProvider>
  </React.StrictMode>
);
