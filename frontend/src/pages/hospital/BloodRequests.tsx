/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { BloodRequest } from "../../types/stock";

const HospitalBloodRequests = () => {
  const { state, getAccessToken } = useAuthContext();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [hospital, setHospital] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch hospital data and blood requests
  useEffect(() => {
    const fetchData = async () => {
      if (state?.isAuthenticated) {
        try {
          setIsLoading(true);
          setError(null);

          const accessToken = await getAccessToken();
          const { data: userInfo } = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          // Fetch hospital data
          const { data: hospitalInfo } = await axios.get(
            `${backendURL}/api/hospitals/hospital/${userInfo.email}`
          );

          if (!hospitalInfo) {
            setError(
              "Hospital registration not found. Please complete your hospital registration first."
            );
            setIsLoading(false);
            return;
          }

          if (hospitalInfo.status !== "approved") {
            setError(
              `Your hospital registration is ${hospitalInfo.status}. You can view blood requests once your hospital is approved by NBTS.`
            );
            setIsLoading(false);
            return;
          }

          setHospital(hospitalInfo);

          // Fetch hospital's blood requests
          const { data: requests } = await axios.get(
            `${backendURL}/api/hospitals/blood-requests/hospital/${hospitalInfo._id}`
          );
          setBloodRequests(requests);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load blood requests. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [state?.isAuthenticated, getAccessToken]);

  // Filter requests based on search term and status
  const filteredRequests = bloodRequests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get current requests for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get status badge color and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          class: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          icon: ClockIcon,
          text: "Pending Review",
        };
      case "approved":
        return {
          class: "bg-blue-100 text-blue-800 border border-blue-200",
          icon: CheckCircleIcon,
          text: "Approved",
        };
      case "rejected":
        return {
          class: "bg-red-100 text-red-800 border border-red-200",
          icon: XCircleIcon,
          text: "Rejected",
        };
      case "fulfilled":
        return {
          class: "bg-green-100 text-green-800 border border-green-200",
          icon: CheckCircleIcon,
          text: "Fulfilled",
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800 border border-gray-200",
          icon: ClockIcon,
          text: status,
        };
    }
  };

  // Get urgency badge color
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (neededBy: Date) => {
    const now = new Date();
    const needed = new Date(neededBy);
    const diffTime = needed.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hour(s) remaining`;
    } else {
      return `${diffDays} day(s) remaining`;
    }
  };

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

  if (!state?.isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to view your blood requests.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Requests
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes("registration not found") && (
            <button
              onClick={() => (window.location.href = "/hospital-registration")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Complete Registration
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl w-full mb-20">
        <div className="p-6 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Blood Requests
              </h1>
              <p className="text-gray-600 mt-2">
                View and track all blood requests submitted by your hospital
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => (window.location.href = "/request-blood")}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                New Blood Request
              </button>
            </div>
          </div>

          {/* Hospital Info Card */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Hospital Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-blue-700 font-medium">
                  Hospital Name:
                </span>
                <p className="text-blue-900">{hospital?.hospitalName}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  Total Requests:
                </span>
                <p className="text-blue-900">{bloodRequests.length}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  Pending Requests:
                </span>
                <p className="text-blue-900">
                  {
                    bloodRequests.filter((req) => req.status === "pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by blood type, purpose, or request ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 md:w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>

          {/* Requests Table */}
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Blood Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Urgency
                </th>
                <th scope="col" className="px-6 py-3">
                  Purpose
                </th>
                <th scope="col" className="px-6 py-3">
                  Needed By
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Requested Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => {
                const statusBadge = getStatusBadge(request.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <tr
                    key={request._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {request._id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-600 text-lg">
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        {request.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBadge(
                          request.urgency
                        )}`}
                      >
                        {request.urgency.charAt(0).toUpperCase() +
                          request.urgency.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="max-w-xs truncate"
                        title={request.purpose}
                      >
                        {request.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{formatDate(request.neededBy)}</div>
                        <div
                          className={`text-xs ${
                            new Date(request.neededBy) < new Date()
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {getTimeRemaining(request.neededBy)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusBadge.class}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.text}
                      </span>
                      {request.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs">
                          Reason: {request.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {formatDate(request.requestedAt)}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center px-6 py-8 text-gray-500"
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
                        No blood requests found
                      </p>
                      <p className="text-sm mt-1">
                        {bloodRequests.length === 0
                          ? "You haven't submitted any blood requests yet."
                          : "No requests match your current filters."}
                      </p>
                      {bloodRequests.length === 0 && (
                        <button
                          onClick={() =>
                            (window.location.href = "/request-blood")
                          }
                          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Submit Your First Request
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredRequests.length > itemsPerPage && (
            <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredRequests.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredRequests.length}</span>{" "}
                requests
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Previous
                </button>
                {Array.from({
                  length: Math.ceil(filteredRequests.length / itemsPerPage),
                }).map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-200 text-gray-700"
                        : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    paginate(
                      currentPage <
                        Math.ceil(filteredRequests.length / itemsPerPage)
                        ? currentPage + 1
                        : currentPage
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredRequests.length / itemsPerPage)
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage ===
                    Math.ceil(filteredRequests.length / itemsPerPage)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Status Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Status Legend
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Pending - Under review by NBTS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Approved - Request approved
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Fulfilled - Blood delivered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Rejected - Request declined
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalBloodRequests;
