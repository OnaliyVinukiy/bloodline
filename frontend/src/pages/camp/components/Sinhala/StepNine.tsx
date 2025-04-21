/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";

const StepNine: React.FC<StepperPropsCamps> = ({
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
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold font-notoserif text-gray-800">
                  රුධිර පරිත්‍යාග කඳවුරේ කටයුතු සංවිධානය කිරීම
                </h2>
              </div>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                සෑම ලේ බිංදුවක්ම වැදගත්. අපි එක්ව වෙනසක් කරමු!
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                <ul className="list-disc pl-6 mt-6 space-y-4">
                  <li>
                    ලේ දන් දීමේ කඳවුර පවත්වන ස්ථානයේ සාමකාමී පරිසරයක් පවත්වා
                    ගැනීමට සංවිධායකවරුන් කටයුතු කළ යුතු ය.
                  </li>
                  <li>අධික ශබ්දයෙන් තොර වටපිටාවක් සුදානම් කළ යුතුයි.</li>
                  <li>
                    කඳවුර සඳහා සහභාගි වන නිලධාරීන්ගේ ආරක්‍ෂාව තහවුරු වන ලෙස
                    කටයුතු යෙදිය යුතුයි
                  </li>
                  <li>
                    ප්‍රධාන සංවිධායකවරයා විසින් ලේ බැංකුව සමඟ සම්බන්ධතාව පවත්වා
                    ගන්නා අතරතුර ඔහු යටතේ ඇති අනු කමිටු මඟින් සංවිධාන කටයුතු
                    විධිමත් ව සිදු කළ හැකි ය.
                    <strong className="text-red-700">
                      ලේ පරිත්‍යාගශීලීන් සෙවීමේ කමිටුව
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      ශාලාව සහ ලේ ගන්නා ස්ථානය පිළියෙළ කිරීමේ කමිටුව
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      සංග්‍රහ කටයුතු භාර කමිටුව
                    </strong>
                    , and{" "}
                  </li>
                  <li>
                    සංවිධාන කමිටු රැස්වීම් පවත්වා වරින් වර සංවිධාන කටයුතු පිළිබඳ
                    ප්‍රති සමාලෝචනය කිරීම ඉතා වැදගත් වේ.
                  </li>
                  <li>
                    ප්‍රමාණවත් තරම් දායකයින් ගෙන්වා ගත නො නැකි බවක් හැඟේ නම් වැඩ
                    සටහන කල් දැමීම හෝ අවලංගු කිරීම කල් ඇතිව සිදු කළ යුතුය.
                  </li>
                  <li>
                    ලේ දන් දීමේ කඳවුරකට අප සුදානම් වන සංඛ්‍යාව ඉක්මවා රුධිර
                    දායකයින් පැමිණෙන අවස්ථාවල දී, සියළු දෙනාගේ පි රුධිරය ලබා
                    ගැනීමට ජාතික රුධිර පාරවිලයන සේවයට නොහැකි වනු ඇත. එවැනි
                    අවස්ථාවක, එම රුධිර පරිත්‍යා ගිලින්ගේ තොරතුරු ලබා ගෙන පසු
                    අවස්ථාවක ඔවුන්ගෙන් රුධිරය ලබා ගැනීමට ජාතික රුධිර පාරවිලයන
                    සේවය කටයුතු කරනු ලැබේ. මේ පිළිබඳව ද. ඔබ කණ්ඩායම් හොඳින්
                    දැනුවත් කිරීම වැදගත් වේ.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg font-notoserif text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                පිටුපසට

              </button>
              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-notoserif font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
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

export default StepNine;
