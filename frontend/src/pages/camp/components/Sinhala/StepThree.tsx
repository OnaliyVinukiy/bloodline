/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";

const StepThree: React.FC<StepperPropsCamps> = ({
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
    <div className="flex justify-center bg-white min-h-screen">
      <main className="mt-0 mb-8 w-full max-w-4xl px-4 py-8">
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
                    d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-notoserif font-bold text-gray-800">
                  රුධිර පරිත්‍යාග කඳවුර සඳහා වේලාවක් තෝරා ගැනීම
                </h2>
              </div>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                සෑම ලේ බිංදුවක්ම වැදගත්. අපි එක්ව වෙනසක් කරමු!
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                ලේ දන් දීමේ කඳවුරක් සාමාන්‍යයෙන්{" "}
                <strong className="text-red-700">
                  උදෑසන 9.00 සිට පස්වරු 3.00 දක්වා{" "}
                </strong>{" "}
                වන කාල සීමාව තුළ පවත්වනු ලැබේ. ඔබ ලබා දෙන රුධිරය රෝගීන්ට ලබා
                දීමට පෙර විවිධ සංඝටකවලට වෙන් කිරීමට අවශ්‍ය වන අතර රුධිරය ලබා ගත්
                අවස්ථාවේ සිට පැය 6ක් වැනි කාලයක් ඇතුළත මෙම කටයුත්ත සිදු කළ යුතු
                යි. එබැවින් ඉහත කාල සීමාව ඉක්මවා රුධිය කඳවුරු පවත්වා
                ගෙන යාම අසීරු ය
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                පිටුපසට
              </button>
              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
              >
                ඉදිරියට
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StepThree;
