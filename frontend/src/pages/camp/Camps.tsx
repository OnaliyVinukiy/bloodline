/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { Camp } from "../../types/camp";

const OrganizedCamps = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuthContext();

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  //Fetch appointments
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setIsLoading(true);
        const accessToken = await memoizedGetAccessToken();
        const { data: userInfo } = await axios.post(
          `${backendURL}/api/user-info`,
          { accessToken },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!userInfo.email) {
          console.error("No email found in userInfo");
          setCamps([]);
          return;
        }

        const response = await axios.get(
          `${backendURL}/api/camps/fetch-camp-email/${userInfo.email}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Normalize data to an array
        const campsData = Array.isArray(response.data)
          ? response.data
          : response.data && typeof response.data === "object"
          ? [response.data]
          : [];

        // Sort camps by date
        const sortedCamps = campsData.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setCamps(sortedCamps);
      } catch (error) {
        console.error("Error fetching camps:", error);
        setCamps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCamps();
  }, [memoizedGetAccessToken, backendURL]);

  const handleCancelCamp = async (campId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this camp?"
    );
    if (!isConfirmed) return;

    try {
      const token = await memoizedGetAccessToken();
      await axios.delete(
        `${backendURL}/api/appointments/cancel-appointment/${campId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the camps list
      setCamps((prev) => prev.filter((camp: any) => camp._id !== campId));
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

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
        <div className="text-center mb-10">
          <h1 className="mt-2 text-4xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight pb-2">
            Blood Donations
          </h1>
        </div>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-gray-700 uppercase bg-yellow-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Venue
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-1 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp: any) => (
              <tr
                key={camp._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">{camp.date}</td>
                <td className="px-6 py-4">{camp.startTime}</td>
                <td className="px-6 py-4">{camp.endTime}</td>
                <td className="px-6 py-4">{camp.city}</td>
                <td className="px-6 py-4">{camp.venue}</td>
                {camp.status === "Rejected" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="red">Rejected</button>
                    </div>
                  </td>
                ) : camp.status === "Approved" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="green">Approved</button>
                    </div>
                  </td>
                ) : (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="yellow">Pending</button>
                    </div>
                  </td>
                )}
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleCancelCamp(camp._id)}
                    className={`text-red-800 border border-red-800 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 transition-all duration-300 ${
                      camp.status === "Rejected" ||
                      new Date(camp.date) < new Date()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:text-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                    }`}
                    disabled={
                      camp.status === "Rejected" ||
                      new Date(camp.date) < new Date()
                    }
                  >
                    Cancel Appointment
                  </button>
                </td>
              </tr>
            ))}

            {camps.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No blood donation camps found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizedCamps;
