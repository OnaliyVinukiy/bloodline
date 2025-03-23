/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../types/stepper";
import { Label } from "flowbite-react";
import DatePicker from "react-datepicker";

const StepEleven: React.FC<
  StepperPropsCamps & {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    startTime: string | null;
    setStartTime: (time: string | null) => void;
    endTime: string | null;
    setEndTime: (time: string | null) => void;
  }
> = ({
  onNextStep,
  onPreviousStep,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => {
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  // Generate start time slots (9:00 AM - 2:00 PM)
  const generateStartTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(14, 0, 0, 0);

    while (start <= end) {
      const time = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(time);
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  // Generate end time slots
  const generateEndTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(10, 0, 0, 0);
    const end = new Date();
    end.setHours(15, 0, 0, 0);

    while (start <= end) {
      const time = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(time);
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  const startTimeSlots = generateStartTimeSlots();
  const endTimeSlots = generateEndTimeSlots();

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
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  Book a Slot for the Blood Donation Camp
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 space-y-6">
                <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 font-opensans font-semibold">
                    Pick a date and time slot for the blood donation camp
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
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
                        if (date) {
                          const offset = 5.5 * 60;
                          const offsetDate = new Date(
                            date.getTime() + offset * 60000
                          );
                          setSelectedDate(offsetDate);
                          setStartTime(null);
                          setEndTime(null);
                        }
                      }}
                      inline
                      minDate={new Date()}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-lg p-2 w-full"
                    />
                  </div>
                  {selectedDate && (
                    <div className="w-full">
                      <div className="mb-6">
                        <Label
                          htmlFor="start-time"
                          className="block mb-2 text-md font-semibold font-opensans"
                        >
                          Select Start Time
                        </Label>
                        <select
                          id="start-time"
                          value={startTime || ""}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-lg p-2 w-full"
                        >
                          <option value="" disabled>
                            Choose a start time
                          </option>
                          {startTimeSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-6">
                        <Label
                          htmlFor="end-time"
                          className="block mb-2 text-md font-semibold font-opensans"
                        >
                          Select End Time
                        </Label>
                        <select
                          id="end-time"
                          value={endTime || ""}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-lg p-2 w-full"
                        >
                          <option value="" disabled>
                            Choose an end time
                          </option>
                          {endTimeSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
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
                onClick={handleNext}
                className={`focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  !selectedDate || !startTime || !endTime
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
                }`}
                disabled={!selectedDate || !startTime || !endTime}
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

export default StepEleven;
