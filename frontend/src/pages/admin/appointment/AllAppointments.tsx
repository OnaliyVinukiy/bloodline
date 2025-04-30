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

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("all");

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const isMedicalConditionPresent = (appointment: any) => {
    return (
      appointment.fourthform?.isMedicallyAdvised === "Yes" ||
      appointment.secondForm?.isPregnant === "Yes" ||
      appointment.secondForm?.isTakingTreatment === "Yes" ||
      appointment.secondForm?.isSurgeryDone === "Yes" ||
      appointment.secondForm?.isEngageHeavyWork === "Yes" ||
      appointment.thirdForm?.hadHepatitis === "Yes" ||
      appointment.thirdForm?.hadTyphoid === "Yes" ||
      appointment.fourthForm?.hadVaccination === "Yes"
    );
  };

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

        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [memoizedGetAccessToken]);

  useEffect(() => {
    let results = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (appointment: any) =>
          appointment.donorInfo.fullName.toLowerCase().includes(term) ||
          appointment.donorInfo.nic.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    if (dateFilter && filterType !== "all") {
      results = results.filter((appointment: any) => {
        const appointmentDate = new Date(appointment.selectedDate);

        switch (filterType) {
          case "day":
            return appointment.selectedDate === dateFilter;
          case "month":
            const [year, month] = dateFilter.split("-");
            return (
              appointmentDate.getFullYear() === parseInt(year) &&
              appointmentDate.getMonth() + 1 === parseInt(month)
            );
          case "year":
            return appointmentDate.getFullYear() === parseInt(dateFilter);
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(results);
    setCurrentPage(1);
  }, [appointments, searchTerm, dateFilter, filterType]);

  // Get current appointments
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-1">
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
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name or NIC"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date filter dropdown */}
            <div className="flex gap-2">
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="day">Specific Date</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>

              {filterType !== "all" && (
                <input
                  type={
                    filterType === "year"
                      ? "number"
                      : filterType === "month"
                      ? "month"
                      : "date"
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder={
                    filterType === "year"
                      ? "YYYY"
                      : filterType === "month"
                      ? "YYYY-MM"
                      : "YYYY-MM-DD"
                  }
                  min="2000"
                  max={new Date().getFullYear() + 5}
                />
              )}
            </div>
          </div>
        </div>

        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-yellow-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3"></th>
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
            {currentAppointments.map((appointment: any) => (
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

                <td className="px-4 py-4 whitespace-nowrap">
                  {appointment.donorInfo.nic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                ) : appointment.status === "Pending" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="yellow">Pending</button>
                    </div>
                  </td>
                ) : appointment.status === "Confirmed" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="blue">Confirmed</button>
                    </div>
                  </td>
                ) : appointment.status === "Assessed" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="pink">Assessed</button>
                    </div>
                  </td>
                ) : appointment.status === "Issued" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="indigo">Issued</button>
                    </div>
                  </td>
                ) : appointment.status === "Collected" ? (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="purple">Collected</button>
                    </div>
                  </td>
                ) : (
                  <td className="px-6 py-6 text-center">
                    <div className="badges flex justify-center">
                      <button className="yellow">None</button>
                    </div>
                  </td>
                )}

                <td className="px-4 py-4 text-center">
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

                    {appointment.status !== "Collected" ? (
                      <Link to={`/admin/donation/${appointment._id}`}>
                        <button
                          className="font-medium text-green-600 dark:text-green-500 hover:underline"
                          aria-label="Donate"
                          disabled={
                            appointment.status === "Pending" ||
                            appointment.status === "Rejected"
                          }
                        >
                          <svg
                            className={`w-5 h-6 ${
                              appointment.status === "Pending" ||
                              appointment.status === "Rejected"
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-blue-800 dark:text-white"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 512 512"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M441 7l32 32 32 32c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15L417.9 128l55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-72-72L295 73c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l55 55L422.1 56 407 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0zM210.3 155.7l61.1-61.1c.3 .3 .6 .7 1 1l16 16 56 56 56 56 16 16c.3 .3 .6 .6 1 1l-191 191c-10.5 10.5-24.7 16.4-39.6 16.4H97.9L41 505c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l57-57V325.3c0-14.9 5.9-29.1 16.4-39.6l43.3-43.3 57 57c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-57-57 41.4-41.4 57 57c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-57-57z"
                            />
                          </svg>
                        </button>
                      </Link>
                    ) : (
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
                    )}
                  </div>
                </td>

                <td className="px-1 py-1">
                  {isMedicalConditionPresent(appointment) && (
                    <button
                      className="text-red-500 hover:text-red-400 mr-2"
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
            {filteredAppointments.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No appointments found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredAppointments.length > itemsPerPage && (
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredAppointments.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredAppointments.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-600"
                }`}
              >
                Previous
              </button>
              {Array.from({
                length: Math.ceil(filteredAppointments.length / itemsPerPage),
              }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === index + 1
                      ? "bg-yellow-200 dark:bg-gray-600 text-gray-700 dark:text-white"
                      : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  paginate(
                    currentPage <
                      Math.ceil(filteredAppointments.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredAppointments.length / itemsPerPage)
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage ===
                  Math.ceil(filteredAppointments.length / itemsPerPage)
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
