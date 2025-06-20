import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import MyProvider from "./context/EventContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="964936582019-2gcpia08diq5bqm0lcug91tsgkmshj17.apps.googleusercontent.com">
        <MyProvider>
          <App />
        </MyProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
