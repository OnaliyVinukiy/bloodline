/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect, useState } from "react";
import { StepperPropsCamps } from "../../../../../types/stepper";
import { Label, Modal, Toast } from "flowbite-react";
import { useAuthContext } from "@asgardeo/auth-react";
import { HiExclamation, HiCheck } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Appointment } from "../../../../../types/appointment";

declare global {
  interface Window {
    google: any;
  }
}

const StepOne: React.FC<StepperPropsCamps> = ({ onNextStep }) => {
  const [processingSteps, setProcessingSteps] = useState([
    { name: "First Process", completed: false, officerName: "" },
    { name: "Second Process", completed: false, officerName: "" },
    { name: "Third Process", completed: false, officerName: "" },
  ]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const location = useLocation();
  const appointmentId = location.pathname.split("/").pop();
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { getAccessToken, getBasicUserInfo } = useAuthContext();

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  //Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
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
        // Populate existing processing data
        if (response.data.processing) {
          const updatedSteps = [...processingSteps];
          response.data.processing.forEach((step: any) => {
            const index = updatedSteps.findIndex((s) => s.name === step.name);
            if (index !== -1) {
              updatedSteps[index] = {
                ...updatedSteps[index],
                completed: step.completed,
                officerName: step.officerName,
              };
            }
          });
          setProcessingSteps(updatedSteps);
        }
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setToastMessage("Failed to load appointment data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, getAccessToken]);

  const allStepsCompleted = () => {
    return processingSteps.every((step) => step.completed);
  };

  const isFormValid = () => {
    return processingSteps.every(
      (step) =>
        !step.completed || (step.completed && step.officerName.trim() !== "")
    );
  };

  const canSubmit = () => {
    return allStepsCompleted() && isFormValid();
  };

  const handleCompleteStep = (index: number) => {
    const updatedSteps = [...processingSteps];
    updatedSteps[index].completed = true;
    setProcessingSteps(updatedSteps);
  };

  const handleOfficerNameChange = (index: number, value: string) => {
    const updatedSteps = [...processingSteps];
    updatedSteps[index].officerName = value;
    setProcessingSteps(updatedSteps);
  };

  //Submit form data
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setToastMessage("Please enter officer names for all completed steps");
      return;
    }

    if (!allStepsCompleted()) {
      setToastMessage("Please complete all processing steps before submitting");
      return;
    }

    if (appointment?.status === "Collected") {
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
          processing: processingSteps.map((step) => ({
            name: step.name,
            completed: step.completed,
            officerName: step.officerName,
            completedAt: step.completed ? new Date().toISOString() : null,
            recordedBy: userEmail,
          })),
          status: "Processed",
        };

        await axios.patch(
          `${backendURL}/api/appointments/update-appointment/${appointmentId}`,
          requestData,
          config
        );
      } catch (error) {
        console.error("Error updating appointment:", error);
        setToastMessage(
          "Failed to update processing status. Please try again."
        );
      } finally {
        setLoading(false);
        onNextStep();
      }
    } else {
      onNextStep();
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
                  Blood Processing
                </h2>
              </div>
            </div>
            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 space-y-8">
                {processingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {step.name}
                      </h3>
                      <button
                        onClick={() => handleCompleteStep(index)}
                        disabled={step.completed}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          step.completed
                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {step.completed ? (
                          <>
                            <HiCheck className="w-5 h-5" />
                            Completed
                          </>
                        ) : (
                          "Mark as Complete"
                        )}
                      </button>
                    </div>
                    {step.completed && (
                      <div className="mt-4">
                        <Label
                          htmlFor={`officerName-${index}`}
                          className="block mb-2 text-md font-medium text-indigo-900"
                        >
                          Medical Officer Name
                        </Label>
                        <input
                          type="text"
                          id={`officerName-${index}`}
                          value={step.officerName}
                          onChange={(e) =>
                            handleOfficerNameChange(index, e.target.value)
                          }
                          placeholder="Enter officer's name"
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
                disabled={loading || !canSubmit()}
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mr-2 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    ></svg>
                    Updating...
                  </>
                ) : (
                  "Complete Processing"
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
          <Modal show={showModal} onClose={() => handleCloseModal()}>
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
                Processing Completed Successfully!
              </p>
            </Modal.Header>
            <Modal.Body>
              <p className="text-lg text-gray-700">
                The blood processing has been successfully recorded. The blood
                components are now ready for testing!
              </p>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default StepOne;
