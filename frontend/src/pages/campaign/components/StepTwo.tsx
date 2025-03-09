/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/stepper";

const StepTwo: React.FC<StepperPropsCampaign> = ({
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
                <div className="flex-shrink-0">
                  <svg
                    className="w-10 h-10 text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                    />
                  </svg>
                </div>
                Selecting a Date for Your Blood Donation Camp
              </h2>
              <div className="mt-2 text-base md:text-lg text-gray-500">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-base md:text-lg text-justify text-gray-700 leading-relaxed">
                You have the freedom to pick a date that aligns with your
                campaign goals. However, please inform the{" "}
                <strong>
                  National Blood Transfusion Service (NBTS) at Narahenpita
                </strong>{" "}
                or your local blood bank at least{" "}
                <strong>one month in advance</strong>. Weekends and holidays are
                in high demand for blood donation campaigns, so we recommend
                securing your date at least <strong>three months ahead </strong>
                if you’re planning a campaign during these days.
                <br />
                <br />
                If your potential donors are typically unavailable on weekdays
                due to work, a weekend campaign might be the best fit. On the
                other hand, if an organization or company is hosting the event,
                a weekday could be more convenient. Thoughtful planning ensures
                a seamless and impactful campaign, helping save countless lives
                in the process!
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

export default StepTwo;
