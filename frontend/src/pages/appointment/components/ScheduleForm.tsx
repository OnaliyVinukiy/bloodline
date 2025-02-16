import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StepperProps } from "../../../types/types";

const ScheduleForm: React.FC<StepperProps> = ({
  onNextStep,
  onPreviousStep,
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

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <div className="mt-4 space-y-6">
            <div className="flex flex-col items-center p-6">
              <h1 className="text-2xl font-bold text-indigo-900 mb-4">
                Select Date & Time for Appointment
              </h1>

              <div className="mb-6">
                <Label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium"
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
                <div className="mb-6">
                  <Label
                    htmlFor="time-slots"
                    className="block mb-2 text-sm font-medium"
                  >
                    Select an Available Time Slot
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        color={selectedSlot === slot ? "success" : "light"}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={onNextStep}
                className="px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-700"
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
