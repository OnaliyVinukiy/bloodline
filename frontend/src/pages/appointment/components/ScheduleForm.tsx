/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useEffect, useState } from "react";
import { Button, Label } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StepperProps } from "../../../types/types";
import axios from "axios";

const ScheduleForm: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //Convert the date format
  const getFormattedDate = (date: Date) => {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().split("T")[0];
  };

  //Fetch booked slots
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      const fetchBookedSlots = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/appointments/${getFormattedDate(
              selectedDate
            )}`
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
  }, [selectedDate]);

  //Format selected date
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
                    setSelectedDate(date);
                    setSelectedSlot(null);
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
                onClick={onNextStep}
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
      </main>
    </div>
  );
};

export default ScheduleForm;
