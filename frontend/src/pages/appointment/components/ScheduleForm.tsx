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

const ScheduleForm: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
  onFormDataChange,
  formData,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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

  // Set the form data when the date and time slot is selected
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      onFormDataChange({ selectedDate, selectedSlot });
    }
  }, [selectedDate, selectedSlot, onFormDataChange]);

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

              {selectedDate && (
                <div>
                  <Label
                    htmlFor="time-slots"
                    className="block mb-2 text-md font-semibold font-opensans"
                  >
                    Select an Available Time Slot
                  </Label>
                  <div className="mt-4 flex flex-wrap gap-5">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        color={selectedSlot === slot ? "success" : "light"}
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
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={onPreviousStep}
                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 dark:hover:text-white "
              >
                Back
              </button>
              <button
                onClick={onNextStep}
                className="focus:outline-none text-white bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
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
