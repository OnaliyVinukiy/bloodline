/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useCallback, useEffect, useState } from "react";
import { Button, Label } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StepperProps } from "../../../types/stepper";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { ValidationModal } from "../../../components/ValidationModal";

const ScheduleForm: React.FC<StepperProps> = ({
  onNextStep,
  onFormDataChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const { getBasicUserInfo } = useAuthContext();
  const [donorAppointments, setDonorAppointments] = useState<any[]>([]);
  const { getAccessToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const memoizedGetAccessToken = useCallback(
    () => getAccessToken(),
    [getAccessToken]
  );

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };
  const [validationModalContent, setValidationModalContent] = useState({
    title: "",
    content: "",
  });

  const showValidationMessage = (title: string, content: string) => {
    setValidationModalContent({ title, content });
    setShowValidationModal(true);
  };

  //Convert the date format
  const getFormattedDate = (date: Date) => {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().split("T")[0];
  };

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  // Fetch donor's previous appointments
  useEffect(() => {
    const fetchDonorAppointments = async () => {
      const token = await memoizedGetAccessToken();
      const user = await getBasicUserInfo();

      try {
        const response = await axios.get(
          `${backendURL}/api/appointments/fetch-appointments/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDonorAppointments(response.data);
      } catch (error) {
        console.error("Error fetching donor appointments:", error);
      }
    };

    fetchDonorAppointments();
  }, [memoizedGetAccessToken, getBasicUserInfo, backendURL]);

  // Check if the selected date is within 4 months of the last appointment
  const checkAppointmentDate = (date: Date) => {
    if (donorAppointments.length > 0) {
      const lastAppointmentDate = new Date(donorAppointments[0].selectedDate);
      const fourMonthsLater = new Date(
        lastAppointmentDate.setMonth(lastAppointmentDate.getMonth() + 4)
      );

      if (date < fourMonthsLater) {
        showValidationMessage(
          "Appointment Restriction",
          "You have already placed an appointment. You cannot place another appointment less than 4 months from your last appointment. Please cancel your existing appointment or select a date after 4 months."
        );
        return false;
      }
    }
    return true;
  };

  // Fetch booked slots
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);

      const fetchBookedSlots = async () => {
        const token = await memoizedGetAccessToken();
        try {
          const response = await axios.get(
            `${backendURL}/api/appointments/${getFormattedDate(selectedDate)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const slots = response.data.map(
            (appointment: any) => appointment.selectedSlot
          );
          setBookedSlots(slots);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching booked slots:", error);
        }
      };
      fetchBookedSlots();
    }
  }, [selectedDate, memoizedGetAccessToken, backendURL]);

  // Format selected date
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      const formattedDate = getFormattedDate(selectedDate);
      onFormDataChange({ selectedDate: formattedDate, selectedSlot });
    }
  }, [selectedDate, selectedSlot, onFormDataChange]);

  // Generate time slots with intervals
  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(17, 0, 0, 0);

    while (start <= end) {
      slots.push(
        `${start.getHours().toString().padStart(2, "0")}:${start
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <div className="mt-4 space-y-6">
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-opensans font-semibold">
                Pick a date and time slot for the blood donation
              </p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="mb-6">
                <Label
                  htmlFor="date"
                  className="block mb-2 text-md font-semibold font-opensans"
                >
                  Select a Date
                </Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    if (date && checkAppointmentDate(date)) {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }
                  }}
                  inline
                  minDate={new Date()}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-lg p-2 w-full"
                />
              </div>
              {selectedDate && isLoading && (
                <div className="loading flex justify-center mt-4">
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
              )}

              {selectedDate && !isLoading && (
                <div>
                  <Label
                    htmlFor="time-slots"
                    className="block mb-2 text-md font-semibold font-opensans"
                  >
                    Select an Available Time Slot
                  </Label>
                  <div className="mt-4 flex flex-wrap gap-5">
                    <div className="mt-4 flex flex-wrap gap-5">
                      {timeSlots.map((slot, index) => (
                        <Button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          color={selectedSlot === slot ? "success" : "light"}
                          disabled={bookedSlots.includes(slot)}
                        >
                          <svg
                            className="w-5 h-5 text-black me-2"
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
                              d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className={`focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  !selectedDate || !selectedSlot
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
                }`}
                disabled={!selectedDate || !selectedSlot}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Validation Modal */}
        <ValidationModal
          show={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          title={validationModalContent.title}
          content={validationModalContent.content}
        />
      </main>
    </div>
  );
};

export default ScheduleForm;
