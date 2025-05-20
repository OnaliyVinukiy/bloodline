/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { Appointment } from "../../../types/appointment";

const ConfirmedAppointments = ({
  appointments,
}: {
  appointments: Appointment[];
}) => {
  const { isAdmin, isLoading } = useUser();
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // Backend URL
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Initialize filtered appointments
  useEffect(() => {
    setFilteredAppointments(appointments);
  }, [appointments]);

  // Fetch city suggestions
  const fetchCitySuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/city/search?q=${query}`
      );
      setCitySuggestions(response.data.map((city: any) => city.city_name_en));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setCitySuggestions([]);
    }
  };

  // Handle city input change
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityFilter(value);

    if (value.length > 2) {
      fetchCitySuggestions(value);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  // Select a city from suggestions
  const selectCity = (city: string) => {
    setCityFilter(city);
    setShowCitySuggestions(false);
    if (cityInputRef.current) {
      cityInputRef.current.focus();
    }
  };

  // Apply filters
  useEffect(() => {
    let results = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (appointment) =>
          appointment.donorInfo.fullName.toLowerCase().includes(term) ||
          appointment.donorInfo.nic.toLowerCase().includes(term)
      );
    }

    // Apply city filter
    if (cityFilter) {
      results = results.filter((appointment) =>
        appointment.donorInfo.city
          ?.toLowerCase()
          .includes(cityFilter.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter && filterType !== "all") {
      results = results.filter((appointment) => {
        if (!appointment.selectedDate) return false;

        const appointmentDate = new Date(appointment.selectedDate);
        if (isNaN(appointmentDate.getTime())) return false;

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
  }, [appointments, searchTerm, dateFilter, cityFilter, filterType]);

  // Get current appointments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Loading animation
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

  // Access denied for non-admins
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

  return (
    <div className="flex justify-center mt-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <div className="mt-4 ml-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
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
                id="table-search-appointments"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name or NIC"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* City Filter */}
            <div className="relative" ref={cityInputRef}>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by city"
                value={cityFilter}
                onChange={handleCityInputChange}
                onFocus={() =>
                  cityFilter.length > 2 && setShowCitySuggestions(true)
                }
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {citySuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectCity(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
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
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            {currentAppointments.map((appointment) => (
              <tr
                key={appointment._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  {appointment.donorInfo.avatar ? (
                    <img
                      className="w-10 h-10 rounded-full"
                      src={appointment.donorInfo.avatar}
                      alt="Donor avatar"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.selectedSlot}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.nic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.donorInfo.contactNumber}
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="badges flex justify-center">
                    <button className="blue">Confirmed</button>
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
                    <Link to={`/admin/donation/${appointment._id}`}>
                      <button
                        className="font-medium text-green-600 dark:text-green-500 hover:underline"
                        aria-label="Donate"
                      >
                        <svg
                          className="w-5 h-6 text-blue-800 dark:text-white"
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
                  </div>
                </td>
                <td className="px-1 py-1">
                  {(appointment.fourthForm?.isMedicallyAdvised === "Yes" ||
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
            {filteredAppointments.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No confirmed appointments found.
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

export default ConfirmedAppointments;
