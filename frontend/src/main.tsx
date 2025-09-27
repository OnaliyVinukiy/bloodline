import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts";
import { Suspense } from "react";

// Check if we're in a production environment or local development
const isProduction = window.location.hostname !== "localhost";

const signInSignOutRedirectURL = isProduction
  ? "https://bloodlinesrilanka.com/"
  : "http://localhost:5173/";

function Loader() {
  return (
    <div className="loading flex justify-center items-center h-screen">
      <svg width="64px" height="48px">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="back"
          stroke="#e53e3e"
          strokeWidth="2"
          fill="none"
        ></polyline>
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="front"
          stroke="#f56565"
          strokeWidth="2"
          fill="none"
        ></polyline>
      </svg>
    </div>
  );
}

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
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </AuthProvider>
  </StrictMode>
);
