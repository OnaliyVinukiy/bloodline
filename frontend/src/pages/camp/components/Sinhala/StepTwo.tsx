/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";

const StepTwo: React.FC<StepperPropsCamps> = ({
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
                <h2 className="text-3xl md:text-4xl font-bold font-notoserif text-gray-800">
                  ඔබගේ රුධිර පරිත්‍යාග කඳවුර සඳහා දිනයක් තෝරා ගැනීම
                </h2>
              </div>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                සෑම ලේ බිංදුවක්ම වැදගත්. අපි එක්ව වෙනසක් කරමු!
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                ලේ දන් දීමේ කඳවුර පවත්වන දිනය ඔබට අවශ්‍ය පරිදි තීරණය කළ හැකි ය.
                එක් මාසයකටවත් පෙර ඒ පිළිබඳව{" "}
                <strong className="text-red-700">
                  {" "}
                  නාරාහේන්පිට ජාතික රුධිර මධ්‍යස්ථානය{" "}
                </strong>{" "}
                හෝ ඔබ ප්‍රදේශයේ ලේ බැංකුව සමඟ හෝ සාකච්ජා කළ යුතුය.
                <br />
                <br />
                සති අන්තයේ හෝ නිවාඩු දිනවල ලේ දන් දීමේ කඳවුරු සඳහා විශාල
                ඉල්ලුමක් ඇති බැවින් ඇතැම් විට{" "}
                <strong className="text-red-700">මාස 3 කට පමණ පෙර</strong> දින
                වෙන් කර ගැනීම අවශ්‍ය වේ. හදිසියේ සංවිධානය කරන කඳවුරු සඳහා දින
                ලබා ගතහැක්කේ ඉඩකඩ ඇති අයුරිනි. ඔබ අයත් වන ප්‍රදේශයේ ජීවත් වන
                රුධිර පරිත්‍යාගශීලීන් සතියේ දිනවල රාජකාරි සඳහා බැහැර ව සිටින්නන්
                නම් නිවාඩු දිනයක ලේ දන් දීමේ කඳවුර යොදා ගත හැකි ය. මෙ වැන්නක්
                යම්කිසි ආයතනයක පවත්වන්නේ නම් ඒ සඳහා සතියේ වැඩ කරන දිනයක් යොදා
                ගැනීම වැදගත් වේ.
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

export default StepTwo;
