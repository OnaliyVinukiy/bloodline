/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import { useAuthContext } from "@asgardeo/auth-react";

const CampDetails = () => {
  const { id } = useParams();
  const { state, getAccessToken } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [camp, setCamp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApprovedToastOpen, setIsApprovedToastOpen] = useState(false);
  const [isRejectedToastOpen, setIsRejectedToastOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch user info and check admin role
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.isAuthenticated) {
        try {
          setIsLoading(true);
          const accessToken = await getAccessToken();
          const response = await axios.post(
            `${backendURL}/api/user-info`,
            { accessToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (
            response.data.role &&
            response.data.role.includes("Internal/Admin")
          ) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [state?.isAuthenticated, getAccessToken]);

  //Fetch camp data
  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(
          `${backendURL}/api/camps/fetch-camp/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCamp(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching camp:", error);
        setError("Failed to fetch camp details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCamp();
  }, [id]);

  //Handle approve camp
  const handleApprove = async () => {
    const token = await getAccessToken();

    try {
      setIsApproving(true);
      await axios.put(
        `${backendURL}/api/camps/approve-camp/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCamp((prev: any) => ({ ...prev, status: "Approved" }));
      setIsApprovedToastOpen(true);

      setTimeout(() => {
        window.location.href = "http://localhost:5173/admin/camps";
      }, 1500);
    } catch (error) {
      console.error("Error approving camp:", error);
      setError("Failed to approve camp.");
    } finally {
      setIsApproving(false);
      setIsApproveModalOpen(false);
    }
  };

  //Handle reject camp
  const handleReject = async () => {
    const token = await getAccessToken();

    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      setIsRejecting(true);
      await axios.put(
        `${backendURL}/api/camps/reject-camp/${id}`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCamp((prev: any) => ({ ...prev, status: "Rejected" }));
      setIsRejectedToastOpen(true);

      setTimeout(() => {
        window.location.href = "http://localhost:5173/admin/camps";
      }, 1500);
    } catch (error) {
      console.error("Error rejecting camp:", error);
      setError("Failed to reject camp.");
    } finally {
      setIsRejecting(false);
      setIsRejectModalOpen(false);
      setRejectionReason("");
    }
  };

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
    <div className="flex justify-center items-center bg-gray-50">
      <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold font-roboto text-indigo-900 mb-8">
            Organizer's Details
          </h2>
          <div className="space-y-4 font-roboto">
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                Organization Name
              </p>
              <span className="text-lg font-semibold text-red-700">
                {camp.organizationName}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                Representative's Name
              </p>
              <span className="text-lg font-semibold text-red-700">
                {camp.fullName}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                Representative's NIC
              </p>
              <span className="text-lg font-semibold text-red-700">
                {camp.nic}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                Contact Number
              </p>
              <span className="text-lg font-semibold text-red-700">
                {camp.contactNumber}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">Email</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.email}
              </span>
            </div>
          </div>
          <h2 className="mt-8 text-2xl font-bold font-roboto text-indigo-900 mb-8">
            Camp Details
          </h2>

          <div className="space-y-4 font-roboto">
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">Date</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.date}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">Start Time</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.startTime}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">End Time</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.endTime}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">Venue</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.venue}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">Province</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.province}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">District</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.district}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">City</p>
              <span className="text-lg font-semibold text-red-700">
                {camp.city}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-md font-medium text-gray-700">
                Google Map Link
              </p>
              <span className="text-lg font-semibold text-red-700">
                <a
                  href={camp.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {camp.googleMapLink}
                </a>
              </span>
            </div>

            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(true)}
                className="mt-8 focus:outline-none text-white inline-flex items-center text-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                <svg
                  className="w-5 h-5 me-1 -ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 11.917 9.724 16.5 19 7.5"
                  />
                </svg>
                Approve
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="ml-2 mt-8 focus:outline-none text-white inline-flex items-center text-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                <svg
                  className="w-5 h-5 me-1 -ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        show={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
      >
        <Modal.Header>Approve Camp</Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">
            Are you sure you want to approve this blood donation camp?
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={handleApprove}>
            {isApproving ? (
              <>
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
                Approving...
              </>
            ) : (
              "Yes"
            )}
          </Button>
          <Button
            color="failure"
            outline
            onClick={() => setIsApproveModalOpen(false)}
            className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {isRejectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800">Reject Camp</h2>
            <p className="text-sm text-gray-600 mt-2">
              Provide a reason for rejection:
            </p>

            <textarea
              className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-red-800 hover:text-white border border-red-800 hover:bg-red-700 rounded-lg text-sm hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="px-4 py-2 bg-red-700 text-white rounded-lg  text-sm hover:bg-red-800 disabled:bg-red-400 flex items-center justify-center"
              >
                {isRejecting ? (
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
                    <span>Rejecting</span>
                  </div>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isRejectedToastOpen && (
        <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Rejected successfully.</div>
          <Toast.Toggle onClick={() => setIsRejectedToastOpen(false)} />
        </Toast>
      )}

      {isApprovedToastOpen && (
        <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Approved successfully.</div>
          <Toast.Toggle onClick={() => setIsApprovedToastOpen(false)} />
        </Toast>
      )}
    </div>
  );
};

export default CampDetails;
