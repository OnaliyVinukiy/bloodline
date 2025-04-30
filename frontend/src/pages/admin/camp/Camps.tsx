/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import PendingCamps from "./PendingCamps";
import ApprovedCamps from "./ApprovedCamps";
import RejectedCamps from "./RejectedCamps";
import AllCamps from "./AllCamps";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";

const Camps = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info and check admin role
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

          if (
            response.data.role &&
            response.data.role.includes("Internal/Admin")
          ) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You don't have permission to view this page. Only administrators can
            access this content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex justify-center border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab1")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab1"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              All
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab2")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab2"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Pending
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab3")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab3"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Approved
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab4")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab4"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Rejected
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "tab1" && <AllCamps />}
        {activeTab === "tab2" && <PendingCamps />}
        {activeTab === "tab3" && <ApprovedCamps />}
        {activeTab === "tab4" && <RejectedCamps />}
      </div>
    </div>
  );
};

export default Camps;
