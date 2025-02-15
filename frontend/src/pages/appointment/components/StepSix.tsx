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

const StepSix: React.FC<StepperProps> = ({ onNextStep, onPreviousStep }) => {
  const [formState, setFormState] = useState({
    hadDengue: null,
    hadOtherFever: null,
    hadImprisoned: null,
    hadDentalExtraction: null,
    hadAntibiotic: null,
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
                  1.) During last 6 months, have you had Dengue fever?
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="yes"
                      checked={formState.hadDengue === "yes"}
                      onChange={handleRadioChange("hadDengue")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hadDengue"
                      value="no"
                      checked={formState.hadDengue === "no"}
                      onChange={handleRadioChange("hadDengue")}
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
                    2.) During last 1 month, have you had Chicken Pox, Measles,
                    Mumps, Rubella, Diarrhoea or any other long standing(more
                    than one week) fever?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadOtherFever"
                        value="yes"
                        checked={formState.hadOtherFever === "yes"}
                        onChange={handleRadioChange("hadOtherFever")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadOtherFever"
                        value="no"
                        checked={formState.hadOtherFever === "no"}
                        onChange={handleRadioChange("hadOtherFever")}
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
                    3.) During last 1 week, have you had a dental extraction?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadDentalExtraction"
                        value="yes"
                        checked={formState.hadDentalExtraction === "yes"}
                        onChange={handleRadioChange("hadDentalExtraction")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadDentalExtraction"
                        value="no"
                        checked={formState.hadDentalExtraction === "no"}
                        onChange={handleRadioChange("hadDentalExtraction")}
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
                    4.) During last 1 week, have you taken Aspirin, Antibiotics
                    or any other medicine?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAntibiotic"
                        value="yes"
                        checked={formState.hadAntibiotic === "yes"}
                        onChange={handleRadioChange("hadAntibiotic")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadAntibiotic"
                        value="no"
                        checked={formState.hadAntibiotic === "no"}
                        onChange={handleRadioChange("hadAntibiotic")}
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

export default StepSix;
