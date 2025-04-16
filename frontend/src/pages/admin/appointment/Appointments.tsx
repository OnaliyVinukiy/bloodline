/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState } from "react";
import PendingAppointments from "./PendingAppointments";
import ApprovedAppointments from "./ApprovedAppointments";
import RejectedAppointments from "./RejectedAppointments";
import AllAppointments from "./AllAppointments";
import AssessedAppointments from "./AssessedAppointments";
import ConfirmedAppointments from "./ConfirmedAppointments";
import IssuedAppointments from "./IssuedAppointments";
import BloodCollectedAppointments from "./BloodCollectedAppointments";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("tab1");
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
        {activeTab === "tab1" && <AllAppointments />}
        {activeTab === "tab2" && <PendingAppointments />}
        {activeTab === "tab3" && <ApprovedAppointments />}
        {activeTab === "tab4" && <ConfirmedAppointments />}
        {activeTab === "tab5" && <AssessedAppointments />}
        {activeTab === "tab6" && <IssuedAppointments />}
        {activeTab === "tab7" && <RejectedAppointments />}
        {activeTab === "tab8" && <BloodCollectedAppointments />}
      </div>
    </div>
  );
};

export default Appointments;
