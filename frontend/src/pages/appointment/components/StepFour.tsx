/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Label } from "flowbite-react";
import React, { useState } from "react";
import { StepperProps } from "../../../types/types";

const StepFour: React.FC<StepperProps> = ({ onNextStep, onPreviousStep, onFormDataChange, formData }) => {
  const [formThreeData, setFormThreeData] = useState({
    hadHepatitis: null,
    hadTyphoid: null,
  });

  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormThreeData((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

    //Function to move to next step
  const handleNext = () => {
    onFormDataChange({
      ...formData,
      thirdForm: formThreeData,
    });
    onNextStep();
  };

  const [isLoading, setIsLoading] = useState(false);

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
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <main className="mt-2 mb-16 flex justify-center items-center w-full max-w-4xl px-4 py-6 md:w-2/3 lg:w-3/4">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  1.) Have you ever had Jaundice/Hepatitis in the past?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadHepatitis"
                      value="yes"
                      checked={formThreeData.hadHepatitis === "yes"}
                      onChange={handleRadioChange("hadHepatitis")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadHepatitis"
                      value="no"
                      checked={formThreeData.hadHepatitis === "no"}
                      onChange={handleRadioChange("hadHepatitis")}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    2.) During last 2 years, have you had Tuberculosis or
                    Typhoid or taken treatment for them?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTyphoid"
                        value="yes"
                        checked={formThreeData.hadTyphoid === "yes"}
                        onChange={handleRadioChange("hadTyphoid")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTyphoid"
                        value="no"
                        checked={formThreeData.hadTyphoid === "no"}
                        onChange={handleRadioChange("hadTyphoid")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onPreviousStep}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-700"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StepFour;
