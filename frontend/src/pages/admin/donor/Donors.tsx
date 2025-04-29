/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  //Fetch approved appointments
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/donors`);
        setDonors(response.data);
        setFilteredDonors(response.data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Fetch city suggestions
  const fetchCitySuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/cities/search?q=${query}`
      );
      setCitySuggestions(response.data.map((city: any) => city.name));
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

  // Filter donors based on search term, blood group, and city
  useEffect(() => {
    let results = donors;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (donor: any) =>
          donor.fullName.toLowerCase().includes(term) ||
          donor.nic.toLowerCase().includes(term)
      );
    }

    // Apply blood group filter
    if (bloodGroupFilter) {
      results = results.filter(
        (donor: any) => donor.bloodGroup === bloodGroupFilter
      );
    }

    // Apply city filter
    if (cityFilter) {
      results = results.filter((donor: any) =>
        donor.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredDonors(results);
  }, [searchTerm, bloodGroupFilter, cityFilter, donors]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <div className="flex justify-center mt-16">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <div className="mt-4 ml-4 flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
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
                placeholder="Search by name or NIC"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Blood Group Filter */}
            <div className="relative">
              <select
                className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-40 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              >
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group || "All Blood Groups"}
                  </option>
                ))}
              </select>
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
          </div>
        </div>
        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Contact
              </th>
              <th scope="col" className="px-6 py-3">
                NIC
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Blood Group
              </th>
              <th scope="col" className="px-6 py-3">
                DOB
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor: any) => (
              <tr
                key={donor._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {donor.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donor.contactNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.nic}</td>
                <td className="px-6 py-4 whitespace-nowrap">{donor.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donor.bloodGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donor.birthdate}
                </td>
              </tr>
            ))}
            {filteredDonors.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No donors found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Donors;
