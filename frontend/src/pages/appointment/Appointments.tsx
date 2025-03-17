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

const DonorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
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
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const token = await memoizedGetAccessToken();

        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  const handleCancelAppointment = async (appointmentId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!isConfirmed) return;

    try {
      const token = await memoizedGetAccessToken();
      await axios.delete(
        `${backendURL}/api/appointments/cancel-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the appointments list
      setAppointments((prev) =>
        prev.filter((appointment: any) => appointment._id !== appointmentId)
      );
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
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-gray-700 uppercase bg-yellow-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedDate}
                </td>
                <td className="px-6 py-4">{appointment.selectedSlot}</td>

                {appointment.status === "Rejected" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="red">Rejected</button>
                    </div>
                  </td>
                ) : appointment.status === "Approved" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="green">Approved</button>
                    </div>
                  </td>
                ) : (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="yellow ">Pending</button>
                    </div>
                  </td>
                )}

                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    className={`text-red-800 border border-red-800 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 transition-all duration-300 ${
                      appointment.status === "Rejected" ||
                      new Date(appointment.selectedDate) < new Date()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:text-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                    }`}
                    disabled={
                      appointment.status === "Rejected" ||
                      new Date(appointment.selectedDate) < new Date()
                    }
                  >
                    Cancel Appointment
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorAppointments;
