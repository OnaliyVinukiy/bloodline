/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { User } from "../types/users";

type UserContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [contextValue, setContextValue] = useState<UserContextType>({
    user: null,
    isAdmin: false,
    isLoading: true,
    error: null,
  });
  const { state, getAccessToken } = useAuthContext();

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          const accessToken = await getAccessToken();
          const response = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const userData = response.data;
          const isAdmin = userData.role?.includes("Internal/Admin") ?? false;

          setContextValue({
            user: userData,
            isAdmin,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error fetching user info:", error);
          setContextValue({
            user: null,
            isAdmin: false,
            isLoading: false,
            error: error as Error,
          });
        }
      } else {
        setContextValue({
          user: null,
          isAdmin: false,
          isLoading: false,
          error: null,
        });
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
