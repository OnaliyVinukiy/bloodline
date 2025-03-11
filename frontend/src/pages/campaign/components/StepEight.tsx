/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCampaign } from "../../../types/stepper";

const StepEight: React.FC<StepperPropsCampaign> = ({
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
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M48 48h88c13.3 0 24-10.7 24-24s-10.7-24-24-24H32C14.3 0 0 14.3 0 32V136c0 13.3 10.7 24 24 24s24-10.7 24-24V48zM175.8 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-26.5 32C119.9 256 96 279.9 96 309.3c0 14.7 11.9 26.7 26.7 26.7h56.1c8-34.1 32.8-61.7 65.2-73.6c-7.5-4.1-16.2-6.4-25.3-6.4H149.3zm368 80c14.7 0 26.7-11.9 26.7-26.7c0-29.5-23.9-53.3-53.3-53.3H421.3c-9.2 0-17.8 2.3-25.3 6.4c32.4 11.9 57.2 39.5 65.2 73.6h56.1zm-89.4 0c-8.6-24.3-29.9-42.6-55.9-47c-3.9-.7-7.9-1-12-1H280c-4.1 0-8.1 .3-12 1c-26 4.4-47.3 22.7-55.9 47c-2.7 7.5-4.1 15.6-4.1 24c0 13.3 10.7 24 24 24H408c13.3 0 24-10.7 24-24c0-8.4-1.4-16.5-4.1-24zM464 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-80-32a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM504 48h88v88c0 13.3 10.7 24 24 24s24-10.7 24-24V32c0-17.7-14.3-32-32-32H504c-13.3 0-24 10.7-24 24s10.7 24 24 24zM48 464V376c0-13.3-10.7-24-24-24s-24 10.7-24 24V480c0 17.7 14.3 32 32 32H136c13.3 0 24-10.7 24-24s-10.7-24-24-24H48zm456 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H608c17.7 0 32-14.3 32-32V376c0-13.3-10.7-24-24-24s-24 10.7-24 24v88H504z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  Finding Blood Donors
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                Every drop counts. Let’s make a difference together!
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                A successful blood donation camp is a collective effort. With
                sincere dedication and hard work, you can get the help of
                everyone. Friends, sports clubs, voluntary organizations,
                government and non-government institutions are some of the
                parties that can help you.
                <br />
                <br />
                Blood donation camps focused only on personal fame often fail. A
                camp that is fair and free from discrimination based on race,
                caste, political affiliation, or religion will gain support and
                be successful.
                <ul className="list-disc pl-6 mt-6 space-y-4">
                  <li>
                    Healthy individuals aged{" "}
                    <strong className="text-red-700">18 to 55</strong>, weighing
                    more than <strong className="text-red-700">50 kg</strong>,
                    can donate blood once every{" "}
                    <strong className="text-red-700">4 months.</strong>
                  </li>
                  <li>
                    Those who have previously had their blood tested can donate
                    up to the age of 60.
                  </li>
                  <li>
                    Make a list of eligible donors, inform them personally, and
                    encourage them to donate blood.
                  </li>

                  <li>
                    For a successful blood donation camp on a{" "}
                    <strong className="text-red-700">weekday</strong>, at least
                    <strong className="text-red-700"> 50 donors</strong> are
                    needed
                  </li>

                  <li>
                    For a successful blood donation camp on a{" "}
                    <strong className="text-red-700">holiday</strong>, at least
                    <strong className="text-red-700"> 100 donors</strong> are
                    needed
                  </li>
                  <li>
                    Raise awareness about the camp through posters, pamphlets,
                    banners, newspaper advertisements
                  </li>
                  <li>
                    Also inform blood donors by holding meetings in public
                    institutions in the area. For example, school
                    societies, banks, etc.
                  </li>
                  <li>
                    Publicity work can be done using speakerphones on the day of
                    the camp and the day before. Remember to obtain the
                    necessary permission for this in advance. Orators and poets
                    who can speak to the hearts of people can do a
                    great service here. Radio and television advertisements can
                    also be used.
                  </li>
                  <li>
                    The date, time, and venue of the blood donation camp should
                    be clearly advertised. It is also important to highlight the
                    importance of donating blood.
                  </li>
                </ul>
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

export default StepEight;
