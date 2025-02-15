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

const StepFour: React.FC<StepperProps> = ({ onNextStep, onPreviousStep }) => {
  const [formState, setFormState] = useState({
    hadVaccination: null,
    hadAcupuncture: null,
    hadImprisoned: null,
    hadTravelledAbroad: null,
    hadReceivedBlood: null,
    hadMaleria: null,
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
                  During past 12 months
                </Label>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  1.) Have you received any vaccination?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadVaccination"
                      value="yes"
                      checked={formState.hadVaccination === "yes"}
                      onChange={handleRadioChange("hadVaccination")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadVaccination"
                      value="no"
                      checked={formState.hadVaccination === "no"}
                      onChange={handleRadioChange("hadVaccination")}
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
                    2.) Have you had tattooing, ear/body piercing or acupuncture
                    treatement?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAcupuncture"
                        value="yes"
                        checked={formState.hadAcupuncture === "yes"}
                        onChange={handleRadioChange("hadAcupuncture")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAcupuncture"
                        value="no"
                        checked={formState.hadAcupuncture === "no"}
                        onChange={handleRadioChange("hadAcupuncture")}
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
                    3.) Have you been imprisoned for any reason?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadImprisoned"
                        value="yes"
                        checked={formState.hadImprisoned === "yes"}
                        onChange={handleRadioChange("hadImprisoned")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadImprisoned"
                        value="no"
                        checked={formState.hadImprisoned === "no"}
                        onChange={handleRadioChange("hadImprisoned")}
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
                    4.) Have you or your partner travelled abroad?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTravelledAbroad"
                        value="yes"
                        checked={formState.hadTravelledAbroad === "yes"}
                        onChange={handleRadioChange("hadTravelledAbroad")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadTravelledAbroad"
                        value="no"
                        checked={formState.hadTravelledAbroad === "no"}
                        onChange={handleRadioChange("hadTravelledAbroad")}
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
                    5.) Have you or your partner received blood or blood
                    products?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadReceivedBlood"
                        value="yes"
                        checked={formState.hadReceivedBlood === "yes"}
                        onChange={handleRadioChange("hadReceivedBlood")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadReceivedBlood"
                        value="no"
                        checked={formState.hadReceivedBlood === "no"}
                        onChange={handleRadioChange("hadReceivedBlood")}
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
                    6.) Have you had Malaria or taken treatment for Malaria?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadMaleria"
                        value="yes"
                        checked={formState.hadMaleria === "yes"}
                        onChange={handleRadioChange("hadMaleria")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadMaleria"
                        value="no"
                        checked={formState.hadMaleria === "no"}
                        onChange={handleRadioChange("hadMaleria")}
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

export default StepFour;
