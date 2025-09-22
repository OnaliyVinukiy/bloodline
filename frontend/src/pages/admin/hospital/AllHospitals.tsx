/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import { Hospital } from "../../../types/users";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const AllHospitals = ({ hospitals }: { hospitals: Hospital[] }) => {
  const { isAdmin, isLoading } = useUser();
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Backend URL
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Initialize filtered appointments
  useEffect(() => {
    setFilteredHospitals(hospitals);
  }, [hospitals]);

  // Apply filters
  useEffect(() => {
    let results = [...hospitals];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((hospital) =>
        hospital.hospitalName.toLowerCase().includes(term)
      );
    }

    setFilteredHospitals(results);
    setCurrentPage(1);
  }, [hospitals, searchTerm]);

  // Handle approve/reject actions
  const handleApprove = async (hospitalId: string) => {
    try {
      setLoadingAction(`approve-${hospitalId}`);
      await axios.patch(`${backendURL}/api/hospitals/${hospitalId}/approve`);
      // Refresh the hospitals list by triggering a parent component update
      window.location.reload();
    } catch (error) {
      console.error("Error approving hospital:", error);
      alert("Error approving hospital. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (hospitalId: string) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setLoadingAction(`reject-${hospitalId}`);
      await axios.patch(`${backendURL}/api/hospitals/${hospitalId}/reject`, {
        rejectionReason: reason,
      });
      // Refresh the hospitals list
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting hospital:", error);
      alert("Error rejecting hospital. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Get current appointments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHospitals = filteredHospitals.slice(
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
                id="table-search-hospitals"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by hospital name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="mt-4 mb-4 w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text- text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Hospital Name
              </th>
              <th scope="col" className="px-6 py-3">
                Hospital Email
              </th>
              <th scope="col" className="px-6 py-3">
                Hospital Contact No
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Name
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Email
              </th>
              <th scope="col" className="px-6 py-3">
                Rep Contact No
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentHospitals.map((hospital) => (
              <tr
                key={hospital.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  {hospital.avatar ? (
                    <img
                      className="w-10 h-10 rounded-full"
                      src={hospital.avatar}
                      alt="Hospital logo"
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
                          d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
                        />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.hospitalName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.hospitalEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.hosContactNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.repFullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.repEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hospital.repContactNumber}
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="badges flex justify-center">
                    {hospital.status === "rejected" ? (
                      <button className="red">Rejected</button>
                    ) : hospital.status === "approved" ? (
                      <button className="green">Approved</button>
                    ) : hospital.status === "pending" ? (
                      <button className="yellow">Pending</button>
                    ) : (
                      <button className="yellow">None</button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleApprove(hospital.id)}
                      disabled={
                        hospital.status !== "pending" ||
                        loadingAction === `approve-${hospital.id}`
                      }
                      className={`p-2 rounded-full ${
                        hospital.status !== "pending"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title="Approve Hospital"
                    >
                      {loadingAction === `approve-${hospital.id}` ? (
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      ) : (
                        <CheckCircleIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(hospital.id)}
                      disabled={
                        hospital.status !== "pending" ||
                        loadingAction === `reject-${hospital.id}`
                      }
                      className={`p-2 rounded-full ${
                        hospital.status !== "pending"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                      title="Reject Hospital"
                    >
                      {loadingAction === `reject-${hospital.id}` ? (
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      ) : (
                        <XCircleIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredHospitals.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No hospitals found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredHospitals.length > itemsPerPage && (
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredHospitals.length)}
              </span>{" "}
              of <span className="font-medium">{filteredHospitals.length}</span>{" "}
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
                length: Math.ceil(filteredHospitals.length / itemsPerPage),
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
                      Math.ceil(filteredHospitals.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredHospitals.length / itemsPerPage)
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage ===
                  Math.ceil(filteredHospitals.length / itemsPerPage)
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

export default AllHospitals;
