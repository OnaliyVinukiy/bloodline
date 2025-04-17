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
import { Appointment } from "../../types/appointment";

const DonorDonations = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  const formatTime = (isoTime: string | undefined): string => {
    if (!isoTime) return "N/A";
    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  //Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const accessToken = await memoizedGetAccessToken();
        const { data: userInfo } = await axios.post(
          `${backendURL}/api/user-info`,
          { accessToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointments/${userInfo.email}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Sort appointments by date
        const sortedAppointments = response.data.sort(
          (a: any, b: any) =>
            new Date(b.selectedDate).getTime() -
            new Date(a.selectedDate).getTime()
        );

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [memoizedGetAccessToken]);

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
  const collectedAppointments = appointments.filter(
    (appointment: any) => appointment.status === "Collected"
  );

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
                Slot
              </th>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-1 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {collectedAppointments.map((appointment: Appointment) => (
              <tr
                key={appointment._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedDate}
                </td>
                <td className="px-6 py-4">{appointment.selectedSlot}</td>
                <td className="px-6 py-4">
                  {formatTime(appointment.bloodCollection?.startTime)}
                </td>
                <td className="px-6 py-4">
                  {formatTime(appointment.bloodCollection?.endTime)}
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="badges flex justify-center">
                    <button className="blue">Collected</button>
                  </div>
                </td>
              </tr>
            ))}
            {collectedAppointments.length === 0 && (
              <tr>
                <td
                  colSpan={6} 
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No blood donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorDonations;
