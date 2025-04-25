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
import { HiExclamation, HiCheck, HiX } from "react-icons/hi";
import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";

declare global {
  interface Window {
    google: any;
  }
}

const StepTwo: React.FC<StepperPropsCamps> = ({
  onPreviousStep,
  onNextStep,
}) => {
  const [tests, setTests] = useState([
    {
      disease: "HIV",
      tested: false,
      result: "",
      technicianName: "",
      testedAt: "",
    },
    {
      disease: "Hepatitis B",
      tested: false,
      result: "",
      technicianName: "",
      testedAt: "",
    },
    {
      disease: "Hepatitis C",
      tested: false,
      result: "",
      technicianName: "",
      testedAt: "",
    },
    {
      disease: "Syphilis",
      tested: false,
      result: "",
      technicianName: "",
      testedAt: "",
    },
    {
      disease: "Malaria",
      tested: false,
      result: "",
      technicianName: "",
      testedAt: "",
    },
  ]);

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [diseasedTests, setDiseasedTests] = useState<string[]>([]);
  const appointmentId = location.pathname.split("/").pop();
  const { getAccessToken, getBasicUserInfo } = useAuthContext();

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
        setAppointment(response.data);

        // Populate existing testing data
        if (response.data.bloodTests) {
          const updatedTests = [...tests];
          response.data.bloodTests.forEach((test: any) => {
            const index = updatedTests.findIndex(
              (t) => t.disease === test.disease
            );
            if (index !== -1) {
              updatedTests[index] = {
                ...updatedTests[index],
                tested: test.tested,
                result: test.result,
                technicianName: test.technicianName,
                testedAt: test.testedAt,
              };
            }
          });
          setTests(updatedTests);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setToastMessage("Failed to load appointment data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, getAccessToken]);

  const handleTestComplete = (index: number) => {
    const updatedTests = [...tests];
    updatedTests[index].tested = true;
    updatedTests[index].testedAt = new Date().toISOString();
    setTests(updatedTests);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedTests = [...tests];
    updatedTests[index] = {
      ...updatedTests[index],
      [field]: value,
    };
    setTests(updatedTests);
  };

  const isFormValid = () => {
    return tests.every(
      (test) =>
        !test.tested || (test.tested && test.result && test.technicianName)
    );
  };

  const allTestsCompleted = () => {
    return tests.every((test) => test.tested);
  };

  const hasPositiveResults = () => {
    return tests.some((test) => test.tested && test.result === "Positive");
  };

  const getPositiveTests = () => {
    return tests
      .filter((test) => test.tested && test.result === "Positive")
      .map((test) => test.disease);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setToastMessage("Please fill all required fields for completed tests");
      return;
    }

    if (!allTestsCompleted()) {
      setToastMessage("Please complete all tests before submitting");
      return;
    }

    if (hasPositiveResults() && appointment.status === "Processed") {
      setDiseasedTests(getPositiveTests());
      setShowDiseaseModal(true);
      return;
    }

    await submitTestResults("Tested");
  };

  const handleConfirmDiseased = async () => {
    setShowDiseaseModal(false);
    await submitTestResults("Diseased", true);
  };

  const submitTestResults = async (
    status: string,
    deferDonor: boolean = false
  ) => {
    if (appointment?.status === "Processed") {
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
          bloodTests: tests.map((test) => ({
            disease: test.disease,
            tested: test.tested,
            result: test.result,
            technicianName: test.technicianName,
            testedAt: test.testedAt,
            recordedBy: userEmail,
          })),
          status: status,
          deferralReason: deferDonor
            ? `Positive test results for: ${diseasedTests.join(", ")}`
            : undefined,
        };

        // Update appointment
        await axios.patch(
          `${backendURL}/api/appointments/update-appointment/${appointmentId}`,
          requestData,
          config
        );

        if (deferDonor && appointment?.donorInfo?.email) {
          const donorUpdate = {
            email: appointment.donorInfo.email,
            status: "Deferred",
            deferralReason: `Positive test results for: ${diseasedTests.join(
              ", "
            )}`,
            deferralDate: new Date().toISOString(),
          };

          await axios.post(
            `${backendURL}/api/donors/upsert`,
            donorUpdate,
            config
          );
        }

        if (!hasPositiveResults()) {
          onNextStep();
        } else {
          setToastMessage("Blood marked as diseased. Donor has been deferred.");
        }
      } catch (error) {
        console.error("Error updating records:", error);
        setToastMessage("Failed to update records. Please try again.");
      } finally {
        setLoading(false);
      }
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
                  Blood Testing Results
                </h2>
              </div>
            </div>

            {/* Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 space-y-8">
                {tests.map((test, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {test.disease}
                      </h3>
                      <button
                        onClick={() => handleTestComplete(index)}
                        disabled={test.tested}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          test.tested
                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {test.tested ? (
                          <>
                            <HiCheck className="w-5 h-5" />
                            Tested
                          </>
                        ) : (
                          "Mark as Tested"
                        )}
                      </button>
                    </div>

                    {test.tested && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label
                            htmlFor={`result-${index}`}
                            className="block mb-2 text-md font-medium text-indigo-900"
                          >
                            Test Result
                          </Label>
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`result-${index}`}
                                value="Positive"
                                checked={test.result === "Positive"}
                                onChange={() =>
                                  handleInputChange(index, "result", "Positive")
                                }
                                className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                                required
                              />
                              <span className="ml-2 text-gray-700">
                                Positive
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`result-${index}`}
                                value="Negative"
                                checked={test.result === "Negative"}
                                onChange={() =>
                                  handleInputChange(index, "result", "Negative")
                                }
                                className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                                required
                              />
                              <span className="ml-2 text-gray-700">
                                Negative
                              </span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor={`technician-${index}`}
                            className="block mb-2 text-md font-medium text-indigo-900"
                          >
                            Technician Name
                          </Label>
                          <input
                            type="text"
                            id={`technician-${index}`}
                            value={test.technicianName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "technicianName",
                                e.target.value
                              )
                            }
                            placeholder="Enter technician's name"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
                disabled={
                  loading ||
                  !isFormValid() ||
                  !allTestsCompleted() ||
                  appointment.status !== "Processed"
                }
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
                  "Complete Testing"
                )}
              </button>
            </div>
          </div>

          {/* Disease Confirmation Modal */}
          <Modal
            show={showDiseaseModal}
            onClose={() => setShowDiseaseModal(false)}
            size="md"
          >
            <Modal.Header className="border-b-0 pb-0">
              <div className="flex items-center gap-2 text-red-600">
                <HiX className="w-6 h-6" />
                <span className="text-xl font-bold">Positive Test Results</span>
              </div>
            </Modal.Header>
            <Modal.Body className="pt-4">
              <div className="space-y-4">
                <p className="text-gray-700">
                  The following tests returned positive results:
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  {diseasedTests.map((disease) => (
                    <li key={disease}>{disease}</li>
                  ))}
                </ul>
                <p className="text-gray-700 font-medium">
                  The blood will be marked as diseased and the donor will be
                  deferred. This action cannot be undone.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-t-0 pt-0">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDiseaseModal(false)}
                  className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDiseased}
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Confirm
                </button>
              </div>
            </Modal.Footer>
          </Modal>

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
        </div>
      </main>
    </div>
  );
};

export default StepTwo;
