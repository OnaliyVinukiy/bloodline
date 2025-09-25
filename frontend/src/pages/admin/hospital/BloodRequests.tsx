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
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { BloodRequest } from "../../../types/stock";

const BloodRequests = () => {
  const { isAdmin, isLoading } = useUser();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Backend URL
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch blood requests
  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/hospitals/blood-requests`
        );
        setBloodRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error("Error fetching blood requests:", error);
      }
    };

    if (isAdmin) {
      fetchBloodRequests();
    }
  }, [isAdmin]);

  // Apply filters
  useEffect(() => {
    let results = [...bloodRequests];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (request) =>
          request.hospitalName.toLowerCase().includes(term) ||
          request.bloodType.toLowerCase().includes(term) ||
          request.hospitalEmail.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((request) => request.status === statusFilter);
    }

    // Apply urgency filter
    if (urgencyFilter !== "all") {
      results = results.filter((request) => request.urgency === urgencyFilter);
    }

    setFilteredRequests(results);
    setCurrentPage(1);
  }, [bloodRequests, searchTerm, statusFilter, urgencyFilter]);

  // Handle approve/reject actions
  const handleApprove = async (requestId: string) => {
    try {
      setLoadingAction(`approve-${requestId}`);
      await axios.patch(
        `${backendURL}/api/hospitals/blood-requests/${requestId}/approve`
      );
      // Refresh the list
      const response = await axios.get(
        `${backendURL}/api/hospitals/blood-requests`
      );
      setBloodRequests(response.data);
    } catch (error) {
      console.error("Error approving blood request:", error);
      alert("Error approving blood request. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setLoadingAction(`reject-${requestId}`);
      await axios.patch(
        `${backendURL}/api/hospitals/blood-requests/${requestId}/reject`,
        {
          rejectionReason: reason,
        }
      );
      // Refresh the list
      const response = await axios.get(
        `${backendURL}/api/hospitals/blood-requests`
      );
      setBloodRequests(response.data);
    } catch (error) {
      console.error("Error rejecting blood request:", error);
      alert("Error rejecting blood request. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFulfill = async (requestId: string) => {
    try {
      setLoadingAction(`fulfill-${requestId}`);
      await axios.patch(
        `${backendURL}/api/hospitals/blood-requests/${requestId}/fulfill`
      );
      // Refresh the list
      const response = await axios.get(
        `${backendURL}/api/hospitals/blood-requests`
      );
      setBloodRequests(response.data);
    } catch (error) {
      console.error("Error marking request as fulfilled:", error);
      alert("Error updating request status. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const viewRequestDetails = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Get current requests for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "fulfilled":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "bg-gray-100 text-gray-800";
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blood Requests Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review and manage blood requests from hospitals
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
              {filteredRequests.length} request(s) found
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
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
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search by hospital name, email, or blood type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="fulfilled">Fulfilled</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Hospital
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
                Needed By
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Requested
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr
                key={request._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {request.hospitalName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.hospitalEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-red-600 text-lg">
                    {request.bloodType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">{request.quantity} units</span>
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
                  <div className="text-sm">{formatDate(request.neededBy)}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {formatDate(request.requestedAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => viewRequestDetails(request)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={loadingAction === `approve-${request._id}`}
                          className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                          title="Approve Request"
                        >
                          {loadingAction === `approve-${request._id}` ? (
                            <ClockIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={loadingAction === `reject-${request._id}`}
                          className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                          title="Reject Request"
                        >
                          {loadingAction === `reject-${request._id}` ? (
                            <ClockIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            <XCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                      </>
                    )}

                    {request.status === "approved" && (
                      <button
                        onClick={() => handleFulfill(request._id)}
                        disabled={loadingAction === `fulfill-${request._id}`}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                        title="Mark as Fulfilled"
                      >
                        {loadingAction === `fulfill-${request._id}`
                          ? "..."
                          : "Fulfill"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td
                  colSpan={8}
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
                      No blood requests found
                    </p>
                    <p className="text-sm mt-1">
                      {bloodRequests.length === 0
                        ? "No blood requests have been submitted yet."
                        : "No requests match your current filters."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredRequests.length > itemsPerPage && (
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredRequests.length)}
              </span>{" "}
              of <span className="font-medium">{filteredRequests.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
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
                      ? "bg-blue-200 dark:bg-gray-600 text-gray-700 dark:text-white"
                      : "bg-blue-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
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
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            showDetailModal ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Blood Request Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hospital Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.hospitalName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hospital Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.hospitalEmail}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.contactNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blood Type
                  </label>
                  <p className="mt-1 text-sm font-bold text-red-600">
                    {selectedRequest.bloodType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.quantity} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Urgency
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedRequest.urgency}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requested Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.requestedAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Needed By
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.neededBy)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                  {selectedRequest.purpose}
                </p>
              </div>

              {selectedRequest.rejectionReason && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-red-700">
                    Rejection Reason
                  </label>
                  <p className="mt-1 text-sm text-red-600 bg-red-50 p-3 rounded">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequests;
