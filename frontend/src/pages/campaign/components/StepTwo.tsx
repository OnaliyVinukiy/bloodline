/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/types";

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
              <h2 className="mt-4 text-3xl font-bold text-gray-800">
                Select a Date for Your Blood Donation Campaign
              </h2>
              <div className="mt-2 text-lg text-gray-500">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-md text-justify text-gray-700 leading-relaxed">
                You have the freedom to pick a date that aligns with your
                campaign goals. However, please inform the National Blood
                Transfusion Service (NBTS) at Narahenpita or your local blood
                bank at least <strong>one month in advance</strong>. Weekends
                and holidays are in high demand for blood donation campaigns, so
                we recommend securing your date at least{" "}
                <strong>three months ahead </strong>
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
