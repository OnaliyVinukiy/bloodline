/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Hospital } from "../../../types/users";

const ApprovedHospitals = ({ hospitals }: { hospitals: Hospital[] }) => {
  const { isAdmin, isLoading } = useUser();
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter pending hospitals
  useEffect(() => {
    const approvedHospitals = hospitals.filter(
      (hospital) => hospital.status === "approved"
    );

    let results = [...approvedHospitals];

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

  // Get current hospitals for pagination
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
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
              {filteredHospitals.length} approved request(s)
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
            <div className="relative w-full md:w-1/3">
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
                id="table-search-approved-hospitals"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by hospital name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            </tr>
          </thead>
          <tbody>
            {currentHospitals.map((hospital) => (
              <tr
                key={hospital._id}
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
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
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
              </tr>
            ))}
            {filteredHospitals.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-8 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      No approved hospital requests
                    </p>
                    <p className="text-sm mt-1">
                      All hospital requests have been processed.
                    </p>
                  </div>
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

export default ApprovedHospitals;
