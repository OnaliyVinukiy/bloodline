/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Datepicker, Label } from "flowbite-react";
import React, { useState } from "react";
import { StepperProps } from "../../../types/types";

const StepEight: React.FC<StepperProps> = ({ onNextStep, onPreviousStep }) => {
  const [formState, setFormState] = useState({
    donatingMonth: null,
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
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800">Donor's Declaration</p>
            </div>
            <div className="mt-4 space-y-6">
              <div className="w-full"></div>
              <div className="w-full">
                <ul className="list-disc pl-5 text-gray-800 text-md space-y-2 font-medium">
                  <li>
                    I have read and understood the information regarding blood
                    donation and answered all the questions honestly and
                    correctly and donating my blood voluntarily today, for the
                    benefit of patients.
                  </li>
                  <li>
                    I also agree to follow the instructions given to me by the
                    NBTS, during and after blood donation and accept the
                    responsibility of any consequences of not following those
                    instructions.
                  </li>
                  <li>
                    Further, I give my consent to test my donated blood for HIV,
                    Syphilis, Hepatitis B, Hepatitis C, Malaria and any other
                    required test in any manner deemed appropriate by the NBTS
                    Sri Lanka.
                  </li>
                  <li>
                    Further, I give my consent to be informed about the results
                    of the above tests, as and when required by the NBTS and
                    also to follow any instructions given to me in this regard
                    by the NBTS.
                  </li>
                  <li>
                    I accept that, involving in intentionally spreading an
                    infection is an offence according to the sentences 262 and
                    263 of the penal code.
                  </li>
                </ul>
              </div>

              <div className="mt-6 space-y-6">
                <div className="w-full">
                  <Label
                    htmlFor="donatedBefore"
                    className="block mb-2 text-md font-medium text-indigo-900"
                  >
                    I am willing to be a regular blood donor to save many more
                    human lives through donating blood:
                  </Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="donatingMonth"
                        value="four"
                        checked={formState.donatingMonth === "four"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="mr-2"
                      />
                      Once in a 4 months
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="donatingMonth"
                        value="six"
                        checked={formState.donatingMonth === "six"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="mr-2"
                      />
                      Once in a 6 months
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isHarmfulCategory"
                        value="twelve"
                        checked={formState.donatingMonth === "twelve"}
                        onChange={handleRadioChange("donatingMonth")}
                        className="mr-2"
                      />
                      Once a year
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <Label
                  htmlFor="donatedBefore"
                  className="mb-4 block text-md font-medium text-indigo-900"
                >
                  Enter name and date, to sign the declaration:
                </Label>
                <Label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Donor's Name
                </Label>
                <input
                  type="text"
                  value=""
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
                <Label
                  htmlFor="fullName"
                  className="mt-4 block mb-2 text-sm font-medium text-indigo-900"
                >
                  Date
                </Label>
                <Datepicker className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" />
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

export default StepEight;
