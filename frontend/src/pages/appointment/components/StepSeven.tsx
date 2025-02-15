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

const StepSeven: React.FC<StepperProps> = ({ onNextStep, onPreviousStep }) => {
  const [formState, setFormState] = useState({
    isInformed: null,
    isHarmfulCategory: null,
    hadImprisoned: null,
    hadPersistentFever: null,
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
            <div className="mb-6 p-4 bg-red-200 rounded-lg">
              <p className="text-red-700">Important!</p>
            </div>
            <div className="mt-4 space-y-6">
              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="block mb-2 text-md font-medium text-indigo-900"
                >
                  1.) Do you know that people of following categories should not
                  give blood?
                </Label>
              </div>
              <div className="w-full">
                <ul className="list-disc pl-5 text-gray-800">
                  <li>
                    If you were found to be positive for HIV, Hepatitis B, C or
                    Syphilis infections at any time
                  </li>
                  <li>If you have had multiple sexual partners</li>
                  <li>
                    If you have ever engaged in male to male sexual activity
                  </li>
                  <li>
                    If you have ever injected any drug (esp.Narcotics) not
                    prescribed by a qualified medical practitioner
                  </li>
                  <li>If you have ever worked as a commercial sex worker</li>
                  <li>
                    If you have had sex with a commercial sex worker or an
                    unknown partner during last 1 year
                  </li>
                  <li>
                    If you suspect that you or your partner may have got HIV or
                    any other sexually transmitted infection
                  </li>
                </ul>
                <div className="mt-4 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isInformed"
                      value="yes"
                      checked={formState.isInformed === "yes"}
                      onChange={handleRadioChange("isInformed")}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isInformed"
                      value="no"
                      checked={formState.isInformed === "no"}
                      onChange={handleRadioChange("isInformed")}
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
                    2.) Do you or your sexual partner belong to one of the above
                    categories?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isHarmfulCategory"
                        value="yes"
                        checked={formState.isHarmfulCategory === "yes"}
                        onChange={handleRadioChange("isHarmfulCategory")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isHarmfulCategory"
                        value="no"
                        checked={formState.isHarmfulCategory === "no"}
                        onChange={handleRadioChange("isHarmfulCategory")}
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
                    3.) Are you having persistent fever, diarrhoea, multiple
                    swollen lymph nodes or unintentional weight loss?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadPersistentFever"
                        value="yes"
                        checked={formState.hadPersistentFever === "yes"}
                        onChange={handleRadioChange("hadPersistentFever")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hadPersistentFever"
                        value="no"
                        checked={formState.hadPersistentFever === "no"}
                        onChange={handleRadioChange("hadPersistentFever")}
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

export default StepSeven;
