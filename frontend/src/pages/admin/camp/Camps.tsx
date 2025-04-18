/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useState } from "react";
import PendingCamps from "./PendingCamps";
import ApprovedCamps from "./ApprovedCamps";
import RejectedCamps from "./RejectedCamps";
import AllCamps from "./AllCamps";

const Camps = () => {
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
