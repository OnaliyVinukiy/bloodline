/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

const BloodCollectedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info and check admin role
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  //Fetch collected appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await memoizedGetAccessToken();
        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const collectedAppointments = response.data.filter(
          (appointment: any) =>
            appointment.status === "Collected" ||
            appointment.status === "Processed" ||
            appointment.status === "Tested" ||
            appointment.status === "Labelled" ||
            appointment.status === "Diseased"
        );
        setAppointments(collectedAppointments);
        console.log(collectedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
              placeholder="Search for donors"
            />
          </div>
        </div>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                NIC
              </th>
              <th scope="col" className="px-6 py-3">
                Contact No
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
              <th scope="col" className="px-1 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment: any) => (
              <tr
                key={appointment._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={appointment.donorInfo.avatar}
                    alt="Jese image"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedDate}
                </td>
                <td className="px-6 py-4">{appointment.selectedSlot}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.nic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.contactNumber}
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="badges flex justify-center">
                    <button className="purple">Collected</button>
                  </div>
                </td>

                <td className="px-8 py-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <Link to={`/appointment/${appointment._id}`}>
                      <button
                        className="font-medium text-yellow-400 dark:text-yellow-500 hover:underline"
                        aria-label="View"
                      >
                        <svg
                          className="w-6 h-6 text-yellow-400 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </Link>
                    <Link to={`/admin/testing/${appointment._id}`}>
                      <button
                        className="font-medium text-black-400 dark:text-yellow-500 hover:underline"
                        aria-label="View"
                      >
                        <svg
                          className="mt-0.5 w-5 h-5 text-black-400 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fillRule="evenodd"
                            d="M288 0H160 128C110.3 0 96 14.3 96 32s14.3 32 32 32V196.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512H378.6c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288zM192 196.8V64h64V196.8c0 23.7 6.6 46.9 19 67.1L309.5 320h-171L173 263.9c12.4-20.2 19-43.4 19-67.1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </td>

                <td className="px-1 py-1">
                  {(appointment.fourthform?.isMedicallyAdvised === "Yes" ||
                    appointment.secondForm?.isPregnant === "Yes") && (
                    <button
                      className="text-red-500 hover:text-red-400 ml-2"
                      aria-label="Warning"
                    >
                      <svg
                        className="w-6 h-6 text-red-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No collected appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodCollectedAppointments;
