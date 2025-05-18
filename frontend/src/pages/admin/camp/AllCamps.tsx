/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { Camp } from "../../../types/camp";
import { useUser } from "../../../contexts/UserContext";

interface AllCampsProps {
  camps: Camp[];
  onTeamAllocated: (campId: string, team: string) => void;
}

const AllCamps = ({ camps, onTeamAllocated }: AllCampsProps) => {
  const { isAdmin, isLoading } = useUser();
  const [filteredCamps, setFilteredCamps] = useState<Camp[]>([]);
  const { getAccessToken } = useAuthContext();
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const teams = ["Team 1", "Team 2", "Team 3", "Team 4", "None"];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Initialize filtered camps when camps prop changes
  useEffect(() => {
    setFilteredCamps(camps);
  }, [camps]);

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
    let results = [...camps];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (camp) =>
          camp.organizationName.toLowerCase().includes(term) ||
          camp.fullName.toLowerCase().includes(term)
      );
    }

    // Apply city filter
    if (cityFilter) {
      results = results.filter((camp) =>
        camp.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter && filterType !== "all") {
      results = results.filter((camp) => {
        if (!camp.date) return false;

        const campDate = new Date(camp.date);
        if (isNaN(campDate.getTime())) return false;

        switch (filterType) {
          case "day":
            return camp.date === dateFilter;
          case "month":
            const [year, month] = dateFilter.split("-");
            return (
              campDate.getFullYear() === parseInt(year) &&
              campDate.getMonth() + 1 === parseInt(month)
            );
          case "year":
            return campDate.getFullYear() === parseInt(dateFilter);
          default:
            return true;
        }
      });
    }

    setFilteredCamps(results);
    setCurrentPage(1);
  }, [camps, searchTerm, dateFilter, cityFilter, filterType]);

  // Get current camps for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCamps = filteredCamps.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Allocate selected team for camp
  const allocateTeam = async () => {
    if (!selectedCamp || !selectedTeam) return;

    try {
      setIsAllocating(true);
      const token = await memoizedGetAccessToken();

      // Check team allocation
      const campToAllocate = camps.find(
        (c) => c._id?.toString() === selectedCamp
      );
      if (!campToAllocate) return;

      const isTeamAlreadyAllocated = camps.some(
        (c) =>
          c.date === campToAllocate.date &&
          c.team === selectedTeam &&
          c._id?.toString() !== selectedCamp
      );

      if (isTeamAlreadyAllocated) {
        alert(
          `This team is already allocated for another camp on ${campToAllocate.date}`
        );
        return;
      }

      // Update on server
      await axios.put(
        `${backendURL}/api/camps/allocate-team`,
        { campId: selectedCamp, team: selectedTeam },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update parent component
      onTeamAllocated(selectedCamp, selectedTeam);

      setSelectedCamp(null);
      setSelectedTeam("");
    } catch (error) {
      console.error("Error allocating team:", error);
      alert("Failed to allocate team. Please try again.");
    } finally {
      setIsAllocating(false);
    }
  };

  const getAvailableTeams = (campDate: string) => {
    const allocatedTeams = camps
      .filter((c) => c.date === campDate)
      .map((c) => c.team);

    return teams.filter((team) => !allocatedTeams.includes(team));
  };

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

  // Loading Animation
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
                id="table-search-camps"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by org, rep, or city"
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

        {/* Camps Table */}
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-yellow-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Org Name
              </th>
              <th scope="col" className="px-6 py-3">
                Representative
              </th>
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
                Contact No
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Team
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCamps.map((camp: any) => (
              <tr
                key={camp._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {camp.organizationName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{camp.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{camp.date}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {camp.startTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{camp.endTime}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {camp.contactNumber}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">{camp.city}</td>

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
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {camp.team === "None" ? (
                    <div className="badges flex justify-center">
                      <button
                        className=" blue text-sm hover:bg-blue-200"
                        onClick={() => setSelectedCamp(camp._id)}
                      >
                        Allocate
                      </button>
                    </div>
                  ) : (
                    <div className="badges flex justify-center">
                      <button
                        className=" cyan text-sm "
                        onClick={() => setSelectedCamp(camp._id)}
                      >
                        {camp.team}
                      </button>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <Link to={`/camp/${camp._id}`}>
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
                    <Link to={`/camp/${camp._id}`}>
                      <button
                        className="font-medium text-green-600 dark:text-green-500 hover:underline"
                        aria-label="Approve"
                      >
                        <svg
                          className="w-6 h-6 text-green-600 dark:text-white"
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
                            d="M5 11.917L9.724 16.5 19 7.5"
                          />
                        </svg>
                      </button>
                    </Link>
                    <Link to={`/appointment/${camp._id}`}>
                      <button
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        aria-label="Reject"
                      >
                        <svg
                          className="w-6 h-6 text-red-600 dark:text-white"
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
                            d="M6 18 17.94 6M18 18 6.06 6"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCamps.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No camps found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredCamps.length > itemsPerPage && (
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredCamps.length)}
              </span>{" "}
              of <span className="font-medium">{filteredCamps.length}</span>{" "}
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
                length: Math.ceil(filteredCamps.length / itemsPerPage),
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
                    currentPage < Math.ceil(filteredCamps.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredCamps.length / itemsPerPage)
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === Math.ceil(filteredCamps.length / itemsPerPage)
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Allocate team modal */}
        {selectedCamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Allocate Medical Team
                </h2>
                <button
                  onClick={() => {
                    setSelectedCamp(null);
                    setSelectedTeam("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Team
                </label>
                <select
                  className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  value={selectedTeam}
                >
                  <option value="">Choose a medical team</option>
                  {(() => {
                    const campToAllocate = camps.find(
                      (c) => c._id?.toString() === selectedCamp
                    );
                    if (!campToAllocate) return null;

                    const availableTeams = campToAllocate.date
                      ? getAvailableTeams(campToAllocate.date)
                      : [];

                    return availableTeams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedCamp(null);
                    setSelectedTeam("");
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={allocateTeam}
                  disabled={!selectedTeam || isAllocating}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 ${
                    !selectedTeam || isAllocating
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {isAllocating ? (
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mr-2 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5c0 27.6-22.4 50-50 50S0 78.1 0 50.5 22.4.5 50 .5s50 22.4 50 50z"
                          fill="currentColor"
                          opacity=".2"
                        />
                        <path
                          d="M93.3 50.5c0-23.9-19.4-43.3-43.3-43.3-6.3 0-12.3 1.3-17.8 3.7-1.6.7-2.2 2.6-1.5 4.2.7 1.6 2.6 2.2 4.2 1.5 4.9-2.1 10.2-3.2 15.6-3.2 21.6 0 39.3 17.7 39.3 39.3s-17.7 39.3-39.3 39.3c-21.6 0-39.3-17.7-39.3-39.3 0-6.8 1.7-13.3 5-19.1.9-1.5.4-3.4-1-4.3s-3.4-.4-4.3 1c-3.8 6.4-5.8 13.7-5.8 21.3 0 23.9 19.4 43.3 43.3 43.3s43.3-19.4 43.3-43.3z"
                          fill="currentColor"
                        />
                      </svg>
                      Allocating...
                    </div>
                  ) : (
                    "Allocate Team"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCamps;
