/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect, useState } from "react";
import { StepperPropsCamps } from "../../../../types/stepper";
import { Button, Label, Modal, Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

const StepFour: React.FC<StepperPropsCamps> = ({ onPreviousStep }) => {
  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  const [formData, setFormData] = useState({
    bloodCollection: {
      startTime: "",
      endTime: "",
      volume: "",
      phlebotomistSignature: "",
    },
  });
  const appointmentId = location.pathname.split("/").pop();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const { getAccessToken, getBasicUserInfo } = useAuthContext();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessToken();
        const userInfo = await getBasicUserInfo();
        setUserEmail(userInfo.email || "");
        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //Populate appointment data
        if (response.data.bloodCollection) {
          setFormData({
            bloodCollection: {
              startTime: response.data.bloodCollection.startTime,
              endTime: response.data.bloodCollection.endTime,
              volume: response.data.bloodCollection.volume,
              phlebotomistSignature:
                response.data.bagIssue.phlebotomistSignature,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, getAccessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bloodCollection: {
        ...prev.bloodCollection,
        [name]: value,
      },
    }));
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/admin/appointments");
  };

  //Submit form data
  const handleSubmit = async () => {
    if (
      !formData.bloodCollection.startTime ||
      !formData.bloodCollection.endTime ||
      !formData.bloodCollection.volume ||
      !formData.bloodCollection.phlebotomistSignature
    ) {
      setToastMessage("Please fill all required fields");
      return;
    }

    if (
      new Date(formData.bloodCollection.endTime) <
      new Date(formData.bloodCollection.startTime)
    ) {
      setToastMessage("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const requestData = {
        bloodCollection: {
          startTime: formData.bloodCollection.startTime,
          endTime: formData.bloodCollection.endTime,
          volume: formData.bloodCollection.volume,
          phlebotomistSignature: formData.bloodCollection.phlebotomistSignature,
          collectedAt: new Date().toISOString(),
          recordedBy: userEmail,
        },
        status: "Collected",
      };

      await axios.patch(
        `${backendURL}/api/appointments/update-appointment/${appointmentId}`,
        requestData,
        config
      );

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating appointment:", error);
      setToastMessage("Failed to update appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  //Loading Animation
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
    <div className="flex justify-center bg-white min-h-screen">
      <main className="mt-0 mb-8 w-full max-w-4xl px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl z-0"></div>

          <div className="relative bg-white rounded-xl p-8 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-12 h-12 text-red-700"
                  aria-hidden="true"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  Blood Collection
                </h2>
              </div>
            </div>
            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Start Time
                  </Label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.bloodCollection.startTime}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="fullName"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    End Time
                  </Label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.bloodCollection.endTime}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    Volume
                  </Label>
                  <input
                    type="text"
                    name="volume"
                    placeholder="Enter volume(ml)"
                    value={formData.bloodCollection.volume}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="NIC"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    {" "}
                    Phlebotomist's signature (Enter full name)
                  </Label>
                  <input
                    type="text"
                    name="phlebotomistSignature"
                    placeholder="Enter full name of medical officer"
                    value={formData.bloodCollection.phlebotomistSignature}
                    onChange={handleInputChange}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-red-500 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
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
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>

          {/* Toast*/}
          {toastMessage && (
            <Toast className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <HiExclamation className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <Toast.Toggle onClick={() => setToastMessage(null)} />
            </Toast>
          )}

          <Modal show={showSuccessModal} onClose={handleModalClose}>
            <Modal.Header className="flex items-center gap-2 ">
              <p className="flex items-center gap-2 text-xl text-green-600">
                <svg
                  className="w-6 h-6 text-green-600"
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
                    d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                  />
                </svg>
                Recorded!
              </p>
            </Modal.Header>
            <Modal.Body>
              <p className="text-lg text-gray-700">
                Blood collection recorded successfully!
              </p>
            </Modal.Body>
            <Modal.Footer className="flex justify-end">
              <Button onClick={handleModalClose} color="failure">
                Return to Appointments
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default StepFour;
