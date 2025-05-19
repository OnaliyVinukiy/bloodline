/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import PendingAppointments from "./PendingAppointments";
import ApprovedAppointments from "./ApprovedAppointments";
import RejectedAppointments from "./RejectedAppointments";
import AllAppointments from "./AllAppointments";
import AssessedAppointments from "./AssessedAppointments";
import ConfirmedAppointments from "./ConfirmedAppointments";
import IssuedAppointments from "./IssuedAppointments";
import BloodCollectedAppointments from "./BloodCollectedAppointments";
import { useUser } from "../../../contexts/UserContext";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { isAdmin, isLoading } = useUser();
  const { getAccessToken } = useAuthContext();
  const [appointments, setAppointments] = useState([]);

  // Backend URL
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch all appointments once
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsDataLoading(true);
        const token = await getAccessToken();

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAdmin) {
      fetchAppointments();
    }
  }, [isAdmin, getAccessToken]);

  // Filter appointments by status
  const getFilteredAppointments = (status?: string) => {
    if (!status) return appointments;
    return appointments.filter(
      (appointment: any) => appointment.status === status
    );
  };

  // Loading animation
  if (isLoading || isDataLoading) {
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

  // Access denied for non-admins
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
              Confirmed
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab5")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab5"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Assessed
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab6")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab6"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Issued
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab8")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab8"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Collected
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab7")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab7"
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
        {activeTab === "tab1" && (
          <AllAppointments appointments={appointments} />
        )}
        {activeTab === "tab2" && (
          <PendingAppointments
            appointments={getFilteredAppointments("Pending")}
          />
        )}
        {activeTab === "tab3" && (
          <ApprovedAppointments
            appointments={getFilteredAppointments("Approved")}
          />
        )}
        {activeTab === "tab4" && (
          <ConfirmedAppointments
            appointments={getFilteredAppointments("Confirmed")}
          />
        )}
        {activeTab === "tab5" && (
          <AssessedAppointments
            appointments={getFilteredAppointments("Assessed")}
          />
        )}
        {activeTab === "tab6" && (
          <IssuedAppointments
            appointments={getFilteredAppointments("Issued")}
          />
        )}
        {activeTab === "tab7" && (
          <RejectedAppointments
            appointments={getFilteredAppointments("Rejected")}
          />
        )}
        {activeTab === "tab8" && (
          <BloodCollectedAppointments
            appointments={getFilteredAppointments("Collected")}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
