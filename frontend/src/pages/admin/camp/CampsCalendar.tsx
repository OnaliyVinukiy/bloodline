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
  const [camps, setCamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
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
        const token = await memoizedGetAccessToken();
        const response = await axios.get(
          `${backendURL}/api/camps/fetch-camps`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCamps(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCamps();
  }, []);

  // Filter appointments by selected date
  const filteredCamps = camps.filter(
    (camp: any) => new Date(camp.date).toDateString() === date.toDateString()
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
        onChange={(date) => setDate(date as Date)}
        value={date}
        className="custom-calendar"
        tileClassName="text-center p-2 rounded-md transition duration-200 hover:bg-blue-500 hover:text-white"
      />

      <div className="mt-8 relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <h2 className="text-lg font-semibold text-center mb-4">
          Appointments for {date.toDateString()}
        </h2>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3">
                Org
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
            {filteredCamps.map((camp: any) => (
              <tr
                key={camp._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{camp.startTime}</td>
                <td className="px-6 py-4">{camp.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {camp.organizationName}
                </td>

                <td className="px-6 py-4">{camp.fullName}</td>
                <td className="px-6 py-4">{camp.contactNumber}</td>
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
              </tr>
            ))}
            {filteredCamps.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-6 py-4 text-gray-500">
                  No camps found.
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
