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
import { Camp } from "../../../types/camp";

const AllCamps = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuthContext();
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const teams = ["Team 1", "Team 2", "Team 3", "Team 4", "None"];

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
        const token = await memoizedGetAccessToken();

        // Fetch appointments with Authorization header
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
  }, [memoizedGetAccessToken]);

  //Allocate selected team for camp
  const allocateTeam = async () => {
    if (!selectedCamp || !selectedTeam) return;

    try {
      setIsAllocating(true);
      const token = await memoizedGetAccessToken();

      //Check team allocation
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

      // Proceed with allocation if team is available
      await axios.put(
        `${backendURL}/api/camps/allocate-team`,
        { campId: selectedCamp, team: selectedTeam },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCamps(
        camps.map((c) =>
          c._id?.toString() === selectedCamp ? { ...c, team: selectedTeam } : c
        )
      );
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
              placeholder="Search for organizations"
            />
          </div>
        </div>
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
            {camps.map((camp: any) => (
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
            {camps.length === 0 && (
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
