/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthContext } from "@asgardeo/auth-react";

const CampsCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        const token = await memoizedGetAccessToken();
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
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(
    (appointment: any) =>
      new Date(appointment.selectedDate).toDateString() ===
      selectedDate.toDateString()
  );

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
    <div className="flex flex-col items-center mt-8">
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        className="custom-calendar"
        tileClassName="text-center p-2 rounded-md transition duration-200 hover:bg-blue-500 hover:text-white"
      />

      <div className="mt-8 relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <h2 className="text-lg font-semibold text-center mb-4">
          Appointments for {selectedDate.toDateString()}
        </h2>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Name
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
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment: any) => (
              <tr
                key={appointment._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{appointment.selectedSlot}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.fullName}
                </td>

                <td className="px-6 py-4">{appointment.donorInfo.nic}</td>
                <td className="px-6 py-4">
                  {appointment.donorInfo.contactNumber}
                </td>
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
                      <button className="yellow">Pending</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-6 py-4 text-gray-500">
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

export default CampsCalendar;
