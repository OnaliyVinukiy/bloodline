/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";

const StepSeven: React.FC<StepperPropsCamps> = ({
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
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"
                  />
                </svg>
                <h2 className="text-2xl md:text-4xl font-bold font-notoserif text-gray-800">
                  ලේ පරිත්‍යාගශිලීන්ට සුලු ආහාරයක් සහ පානයක්
                </h2>
              </div>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                සෑම ලේ බිංදුවක්ම වැදගත්. අපි එක්ව වෙනසක් කරමු!
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                රුධිරය පරිත්‍යාග කරන දායකයින්ට බර ආහාරයක් ලබා දීම යෝග්‍ය නොවන
                අතර දියරමය පානයක්,{" "}
                <strong className="text-red-700">
                  තැබිලි වැනි සිසිල් දෙයක්
                </strong>{" "}
                නම් වඩාත් හොඳ ය.
                <br />
                රුධිරය පරිත්‍යාග කිරීමට පෙර{" "}
                <strong className="text-red-700">
                  පිරිසිදු වතුර වීදුරුවක්
                </strong>{" "}
                ලබා දිමෙන් ක්ලාන්තය වැනි අපහසුතා ඇති වීම අවම කර ගත හැකි ය.
                <br />
                එ මෙන් ම රුධිර පරිත්‍යාගශිලින්ට ආහාර පාන ලබා දීමේ දී ඒවා සෞඛ්‍ය
                ආරක්ෂිත ආකාරයට ලබා දීමට කටයුතු කළ යුතු ය.
                <br />
                <br />
                ලේ දීමේ කඳවුරක් ඉතා සාර්ථක වන්නේ ඒ සඳහා කිසිදු ප්‍රතිලාභයක්
                බලාපොරොත්තු නො වන ස්වෙච්ඡා රුධිර දායකයින් පමණක් සහභාගි වුව හොත්
                පමණි. වටිනා ද්‍රව්‍ය ලබා දීමේ දී ස්වෙච්ඡා රුධිර දායක යන සංකල්පය
                ආරක්ෂා කරගත නොහැකි බැවින් එවැනි දෑ පිරිනැමීම ජාතික රුධිර
                පාරවිලයන සේවය{" "}
                <strong className="text-red-700">අනුමත නොකරයි.</strong>
                <br />
                එහෙත් මුදල්මය වටිනාකමක් නොමැති සමරු සිහිවටන සහ සහතික පත් වැනි දෑ
                ලබා දීම කළ හැකි යි. එහෙත් අත්‍යවශ්‍ය නො වේ. වඩා වැදගත් කරුණ
                වන්නේ ස්වේචිඡාවෙන් රුධිරය පරිත්‍යාග කිරීමයි
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

export default StepSeven;
