import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.tsx";
import "./index.css";

// Check if we're in a production environment or local development
const isProduction = window.location.hostname !== "localhost";

const signInSignOutRedirectURL = isProduction
  ? "https://bloodline-gxfvfrfyg7bqbahz.southeastasia-01.azurewebsites.net/"
  : "http://localhost:5173/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider
      config={{
        signInRedirectURL: signInSignOutRedirectURL,
        signOutRedirectURL: signInSignOutRedirectURL,
        clientID: import.meta.env.VITE_CLIENT_ID as string,
        baseUrl: import.meta.env.VITE_BASE_URL as string,
        scope: [
          "openid",
          "profile",
          "email",
          "roles",
          "picture",
          "given_name",
          "family_name",
          "birthdate",
          "internal_user_mgt_create",
          "internal_user_mgt_list",
          "internal_user_mgt_view",
          "internal_user_mgt_delete",
          "internal_user_mgt_update",
          "internal_org_user_mgt_update",
          "internal_org_user_mgt_list",
          "internal_org_user_mgt_create",
          "internal_org_user_mgt_view",
          "internal_role_mgt_create",
          "internal_role_mgt_update",
          "internal_role_mgt_view",
          "internal_role_mgt_delete",
          "internal_bulk_resource_create",
        ],
      }}
    >
      <App />
    </AuthProvider>
  </StrictMode>
);
