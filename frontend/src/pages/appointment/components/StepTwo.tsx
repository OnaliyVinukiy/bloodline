/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Datepicker, Label } from "flowbite-react";
import React, { useState } from "react";

interface StepTwoProps {
  onNextStep: () => void;
  onPreviousStep: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNextStep, onPreviousStep }) => {
  const [formState, setFormState] = useState({
    isDonatedBefore: null,
    isAnyDifficulty: null,
    isMedicallyAdvised: null,
    isLeafletRead: null,
  });

  const handleRadioChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
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
                  1.) Have you donated blood previously?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="yes"
                      checked={formState.isDonatedBefore === "yes"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="donatedBefore"
                      value="no"
                      checked={formState.isDonatedBefore === "no"}
                      onChange={handleRadioChange("isDonatedBefore")}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formState.isDonatedBefore === "yes" && (
                <div>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="first_name"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      1.1.) How many times?
                    </Label>
                    <input
                      type="email"
                      value=""
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      disabled
                    />
                  </div>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="first_name"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      1.2.) Date of last donation
                    </Label>
                    <Datepicker className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" />
                  </div>
                  <div className="mt-4 w-full">
                    <Label
                      htmlFor="difficulty"
                      className="block mb-2 text-sm font-medium text-indigo-900"
                    >
                      1.3.) Did you experience any ailment, difficulty or
                      discomfort during previous donations?
                    </Label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="yes"
                          checked={formState.isAnyDifficulty === "yes"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value="no"
                          checked={formState.isAnyDifficulty === "no"}
                          onChange={handleRadioChange("isAnyDifficulty")}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {formState.isAnyDifficulty === "yes" && (
                      <div className="mt-4 w-full">
                        <Label
                          htmlFor="difficultyDetails"
                          className="block mb-2 text-sm font-medium text-indigo-900"
                        >
                          1.4.) What was the difficulty?
                        </Label>
                        <input
                          type="text"
                          value=""
                          className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                          disabled
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="w-full">
                      <Label
                        htmlFor="donatedBefore"
                        className="block mb-2 text-md font-medium text-indigo-900"
                      >
                        2.) Have you ever been medically advised not to donate
                        blood?
                      </Label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="medicallyAdvised"
                            value="yes"
                            checked={formState.isMedicallyAdvised === "yes"}
                            onChange={handleRadioChange("isMedicallyAdvised")}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="medicallyAdvised"
                            value="no"
                            checked={formState.isMedicallyAdvised === "no"}
                            onChange={handleRadioChange("isMedicallyAdvised")}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="w-full">
                      <Label
                        htmlFor="donatedBefore"
                        className="block mb-2 text-md font-medium text-indigo-900"
                      >
                        3.) Have you read and understood the "Blood donors
                        information leaflet"?
                      </Label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="leafletRead"
                            value="yes"
                            checked={formState.isLeafletRead === "yes"}
                            onChange={handleRadioChange("isLeafletRead")}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="leafletRead"
                            value="no"
                            checked={formState.isLeafletRead === "no"}
                            onChange={handleRadioChange("isLeafletRead")}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onPreviousStep}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={onNextStep}
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

export default StepTwo;
