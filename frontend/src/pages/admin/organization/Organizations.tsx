/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import axios from "axios";

const Organizations = () => {
  const [org, setOrg] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  //Fetch approved appointments
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/organizations/all-organizations`
        );

        setOrg(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  //Loading animation
  if (isLoading) {
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

  return (
    <div className="flex justify-center mt-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <div className="mt-4 ml-4 flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for organizations"
            />
          </div>
        </div>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Org Name
              </th>
              <th scope="col" className="px-6 py-3">
                Org Email
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Name
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Email
              </th>
              <th scope="col" className="px-6 py-3">
                Rep NIC
              </th>
              <th scope="col" className="px-6 py-3">
                Org Contact
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {org.map((org: any) => (
              <tr
                key={org._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {org.organizationName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {org.organizationEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {org.repFullName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">{org.repEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">{org.repNIC}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {org.orgContactNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {org.repContactNumber}
                </td>
              </tr>
            ))}
            {org.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No organizations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organizations;
