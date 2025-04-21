/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React, { useEffect } from "react";
import { StepperPropsCamps } from "../../../../types/stepper";
import { useAuthContext } from "@asgardeo/auth-react";

const StepOne: React.FC<StepperPropsCamps> = ({ onNextStep }) => {
  const { state, signIn } = useAuthContext();

  useEffect(() => {
    if (!state?.isAuthenticated) {
      signIn();
    }
  }, [state]);

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNextStep();
  };

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <main className="mt-0 mb-8 w-full max-w-4xl px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl z-0"></div>

          <div className="relative bg-white rounded-xl p-8 z-10">
            <div className="text-center mb-8">
              <h2 className="mt-4 text-2xl md:text-4xl font-bold font-notoserif text-gray-800">
                රුධිර පරිත්‍යාග කඳවුරක් සංවිධානය කිරීම
              </h2>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                එක්ව, අපට ජීවිත සුරැකිය හැක. අදම ඔබේ කඳවුර සංවිධානය කරන්න!
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <img
                src="/bloodTube.jpg"
                alt="Blood Donation Camp"
                className="rounded-lg shadow-md w-full max-w-2xl h-64 md:h-80 object-cover"
              />
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-lg text-center text-gray-700 leading-relaxed">
                ලේ දන් දීමේ කඳවුරක් සංවිධානය කිරීමේ මූලික අරමුණ වන්නේ රෝගීන්
                සුවපත් කිරීම සඳහා ඔබගේ දායකත්වය ලබා දීම යි. එහෙත් ජාතික, ආගමික,
                පුද්ගලික ආදී කවර හෝ අරමුණක් මුල් කර ගෙන ඔබට ⁣ලේ දන් දීමේ කඳවුරක්
                සංවිධානය කළ හැකි ය. ලේ දන් දීමේ කඳවුරක් ඔබගේ ප්‍රදේශයේ ස්ථානයක
                හෝ අපගේ රුධිර මධ්‍යස්ථානයක් තුළ වුව ද සංවිධානය කළ හැකි ය. ඔබ අප
                ගේ රුධිර මධ්‍යස්ථානයක් තුළ ලේ දන් දීමේ කඳවුරක් පැවැත්වීමට
                බලාපොරත්තු වන්නේ නම් ඊට පූර්ණ දායකත්වය ලබා දීමට අප ගේ සුහදශීලි
                කාර්ය මණ්ඩලය ඇපකැප වී සිටිති. අපගේ රුධිර මධ්‍යස්ථානයක් තුළ ඔබගේ
                ලේ දන් දීමේ කඳවුරක් සංවිධානය කිරීමේ දී, උපන් දිනය වැනි සුවිශේෂී
                දිනයක් නිමිති කර ගනිමින් එය කළ හැකි ය
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700  focus:ring-4 focus:ring-red-300 transition-all duration-300"
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

export default StepOne;
