/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider
      config={{
        signInRedirectURL: "http://localhost:5173/",
        signOutRedirectURL: "http://localhost:5173/",
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
        ],
      }}
    >
      <App />
    </AuthProvider>
  </StrictMode>
);
