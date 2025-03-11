/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/stepper";

const StepFour: React.FC<StepperPropsCampaign> = ({
  onNextStep,
  onPreviousStep,
}) => {
  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPreviousStep();
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <main className="mt-8 mb-8 w-full max-w-4xl px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl z-0"></div>

          <div className="relative bg-white rounded-xl p-8 z-10">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-12 h-12 text-red-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM288 176c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 48.8 46.5 111.6 68.6 138.6c6 7.3 16.8 7.3 22.7 0c22.1-27 68.6-89.8 68.6-138.6zm-112 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  Selecting a Venue for the Blood Donation Camp
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                Selecting the right venue is essential for a smooth and
                successful campaign. Here are some key factors to consider:
                <ul className="list-disc pl-6 mt-6 space-y-4">
                  <li>
                    <strong className="text-red-700">
                      Easily Accessible Location:
                    </strong>{" "}
                    A well-known public place ensures better participation and
                    ease of travel for both donors and staff.
                  </li>
                  <li>
                    <strong className="text-red-700">
                      Good Transport Access:
                    </strong>{" "}
                    The venue should be easily reachable by vehicles, ensuring a
                    hassle-free experience for donors and medical teams.
                  </li>
                  <li>
                    <strong className="text-red-700">
                      Clean & Safe Environment:
                    </strong>{" "}
                    A permanent building with a clean and hygienic surrounding
                    is ideal for maintaining health and safety standards.
                  </li>
                  <li>
                    <strong className="text-red-700">Toilet Facilities:</strong>{" "}
                    Proper restroom facilities must be available for donors and
                    staff throughout the event.
                  </li>
                </ul>
                <br />A well-planned venue creates a comfortable experience for
                everyone involved and contributes to a successful blood donation
                drive!
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
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

export default StepFour;
