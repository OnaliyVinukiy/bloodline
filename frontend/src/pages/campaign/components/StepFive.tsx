/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/stepper";

const StepFive: React.FC<StepperPropsCampaign> = ({
  onNextStep,
  onPreviousStep,
}) => {
  const handleNext = () => {
    onNextStep();
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-gray-50 to-gray-100">
      <main className="mt-8 mb-8 w-full max-w-4xl px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl z-0"></div>

          <div className="relative bg-white rounded-xl p-8 z-10">
            <div className="text-center mb-8">
              <h2 className="mt-4 flex justify-center items-center gap-4 text-2xl md:text-3xl font-bold text-gray-800">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-800 dark:text-white"
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
                    d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
                  />
                </svg>
                Selecting a Building for the Blood Donation Camp
              </h2>
              <div className="mt-2 text-base md:text-lg text-gray-500">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-base md:text-lg text-justify text-gray-700 leading-relaxed">
                Selecting the right venue is essential for a smooth and
                successful campaign. Here are some key factors to consider:
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Easily Accessible Location</strong> – A well-known
                    public place ensures better participation and ease of travel
                    for both donors and staff.
                  </li>
                  <li>
                    <strong>Good Transport Access</strong> – The venue should be
                    easily reachable by vehicles, ensuring a hassle-free
                    experience for donors and medical teams.
                  </li>
                  <li>
                    <strong>Clean & Safe Environment</strong> – A permanent
                    building with a clean and hygienic surrounding is ideal for
                    maintaining health and safety standards.
                  </li>
                  <li>
                    <strong>Toilet Facilities</strong> – Proper restroom
                    facilities must be available for donors and staff throughout
                    the event.
                  </li>
                </ul>
                <br />A well-planned venue creates a comfortable experience for
                everyone involved and contributes to a successful blood donation
                drive!
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={onPreviousStep}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
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

export default StepFive;
