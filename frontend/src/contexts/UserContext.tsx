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

type UserContextType = {
  isAdmin: boolean;
  isLoading: boolean;
  role: string | null;
};

const UserContext = createContext<UserContextType>({
  isAdmin: false,
  isLoading: true,
  role: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContextType>({
    isAdmin: false,
    isLoading: true,
    role: null,
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

          const isAdmin =
            response.data.role?.includes("Internal/Admin") ?? false;

          setUser({
            isAdmin,
            isLoading: false,
            role: response.data.role || null,
          });
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUser((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setUser({
          isAdmin: false,
          isLoading: false,
          role: null,
        });
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
