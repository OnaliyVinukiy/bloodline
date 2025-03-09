/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/stepper";

const StepSeven: React.FC<StepperPropsCampaign> = ({
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                  />
                </svg>
                Equipments & Assets Required
              </h2>
              <div className="mt-2 text-base md:text-lg text-gray-500">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-base md:text-lg text-justify text-gray-700 leading-relaxed">
                To ensure the safety and well-being of both donors and collected
                blood, the National Blood Transfusion Service (NBTS) Sri Lanka
                does not approve the use of temporary buildings like tents. The
                selected venue must meet the following essential requirements:
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Permanent Building</strong> – The facility should be
                    a solid, secure structure to provide a stable and safe
                    environment.
                  </li>
                  <li>
                    <strong>No Water Leakages</strong> – he building must be
                    free from leaks to maintain a hygienic space for the blood
                    donation process.
                  </li>
                  <li>
                    <strong>Clean, Dust-Free Floor</strong> – A flat and
                    dust-free ground ensures a sanitary and comfortable
                    experience for donors and medical staff.
                  </li>
                  <li>
                    <strong>Proper Lighting & Ventilation</strong> – Sufficient
                    lighting and air circulation are necessary for a comfortable
                    and safe atmosphere.
                  </li>
                  <li>
                    <strong>Electricity & Water Facilities</strong> – The venue
                    must have a reliable electricity supply and access to clean
                    water.
                  </li>
                  <li>
                    <strong>Easy Accessibility for Donors</strong> – If the
                    venue is on an upper floor, an elevator must be available
                    for donors. If no elevator is present, the venue should be
                    on the ground floor to avoid the need for stair access.
                  </li>
                </ul>
                <br />
                Before finalizing the venue, organizers must discuss with the
                NBTS or the nearest blood bank to confirm that the space meets
                all necessary requirements. A well-prepared venue ensures a
                smooth and successful blood donation drive!
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

export default StepSeven;
