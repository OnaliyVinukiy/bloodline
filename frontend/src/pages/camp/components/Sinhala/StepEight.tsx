/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";

const StepEight: React.FC<StepperPropsCamps> = ({
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
                <h2 className="text-2xl md:text-4xl font-bold font-notoserif text-gray-800">
                  රුධිර දායකයන් සොයා ගැනීම
                </h2>
              </div>
              <div className="mt-4 text-lg md:text-xl font-notoserif text-gray-600">
                සෑම ලේ බිංදුවක්ම වැදගත්. අපි එක්ව වෙනසක් කරමු!
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-notoserif font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                සාර්ථක ලේ දන් දීමේ කඳවුරක් යනු සාමූහික උත්සාහයක ප්‍රතිඵලයකි. ඒ
                සඳහා අවංකව කැප වී කටයුතු කිරීමෙන් සෑම දෙනාගේම සහයෝගය ලබා ගත හැකි
                ය. සිත මිතුරන්, ක්‍රීඩා සමාජ, ජාතික සංවිධාන, රාජ්‍ය හා රාජ්‍ය නො
                වන ආයතන සහයෝගය ලබා ගත හැකි පාර්යව කිහිපයකි.
                <br />
                <br />
                හුදු ප්‍රදර්ශනය හා පුද්ගල ප්‍රසිද්ධිය පමණක් ඉලක්ක කර ගත්
                වැඩසටහන් බොහෝ විට අසාර්ථක වේ. එසේම ජාති, කුල, ආගම් ආදී භේද වලින්
                තොර වීම, සැම ගේ සහය ලැබීමටත්, කඳවුරේ සාර්ථකත්වයටත් හේතු වේ.
                <ul className="list-disc pl-6 mt-6 space-y-4">
                  <li>
                    වයස අවුරුදු{" "}
                    <strong className="text-red-700">18 - 55 ත් අතර</strong>,
                    නිරෝගි,{" "}
                    <strong className="text-red-700">කිලෝග්‍රෑම් 50ට</strong>{" "}
                    වඩා බර ඇති පුද්ගලයන් හට{" "}
                    <strong className="text-red-700">
                      සිව් (04) මසකට වරක්
                    </strong>{" "}
                    ලේ පරිත්‍යාග කළ හැකි ය.
                  </li>
                  <li>
                    මීට පෙර රුධිරය පරිත්‍යා කළ අයට වයස අවුරුදු 60 දක්වා රුධිරය
                    පරිත්‍යාග කළ හැකිය.
                  </li>
                  <li>
                    සුදුසු පුද්ගලයින් තෝරා ලැයිස්තුවක් සකස් කර ඒ අය පුද්ගලික ව ම
                    දැනුවත් කර ලේ දන් දීම සඳහා යොමු කරවන්න
                  </li>
                  <li>
                    සතියේ දිනයක පවත්වක සාර්ථක රුධිර කඳවුරක අවම වශයෙන් රුධිර
                    දායකයින් 50ක් වත් ලේ පරිත්‍යාග කළ යුතුය.
                  </li>
                  <li>
                    නිවාඩු දිනයක පවත්වන රුධිර කඳවුරක් සඳහා රුධිර පරිත්‍යාගයිලින්
                    අවම වශයෙන් 100 ක් වත් සහභාගි කර ගත යුතුය.
                  </li>
                  <li>
                    පෝස්ටර්, පත්‍රිකා, බැනර් සහ පුවත්පත් දැන්වීම් හරහා කඳවුර
                    පිළිබඳ දැනුවත්භාවය වැඩි කරන්න.
                  </li>
                  <li>
                    ප්‍රදේශයේ පොදු ආයතන තුළ රැස්වීම් පැවැත්වීමෙන් ද රුධිර
                    දායකයින් දැනුවත් කරන්න. උදා: පාසල් සමිති, බැංකු යනාදිය
                  </li>
                  <li>
                    ශබ්ද වාහිනී මඟින් කඳවුරු පැවැත්වෙන දින හා ඊට පෙර දින ද
                    ප්‍රචාරන කටයුතු කළ හැකි ය. මේ සඳහා අවසරය කල් වෙලා ඇති ව ලබා
                    ගැනීමට මතක තබා ගන්න. පුද්ගලයින් ගේ හදවතට කතා කළ හැකි වතුර
                    කථිකයින් සහ කවියන් ආදීන්ට මෙහි දී විශාල මෙහෙයක් සිදු කළ හැකි
                    ය.
                  </li>
                  <li>
                    ලේ දන් දීම සිදු කරන දිනය, වේලාව, ස්ථානය ඉතා පැහැදිලි ව
                    ප්‍රචාරය කළ යුතුයි. රුධිර පරිත්‍යාගයෙන් තමන්ට සිදු වන පුද්ගල
                    යහපත ද පෙන්වා දීම වැදගත් ය.හැකි නම් ගුවන් විදුලි සහ
                    රූපවාහිනි ප්‍රචාරක දැන්වීම සඳහා ද යොමු විය හැකි ය
                  </li>

                  <li>
                    වරක් ⁣ලේ දීමට නොසුදුස්සෙකු වුවත් ඊළඟ වැඩසටහන සඳහා සුදුසුකම්
                    ලැබිය හැකි බැවින් ඔවුන් නැවත කැඳවා ගැනීම වැදගත් ය.
                  </li>
                  <li>
                    ඔබ යම් සංවිධානයක් නියෝජනය කරන්නේ නම් එක් එක් සාමාජිකයාට
                    නිශ්චිත රුධිර පරිත්‍යාගශීලීන් සංඛ්‍යාවක් රැගෙන ඒමට බාර
                    දෙන්න.
                  </li>
                  <li>
                    ගෙයින් ගෙට දැනුවත් කරමින් අදාල දිනයට පැමිණෙන රුධිර
                    පරිත්‍යාගශීලීන්ගේ සංඛ්‍යාව තව දුරටත් වැඩි කර ගත හැකි ය. මෙම
                    ක්‍රමවේදයේ තිබෙන තවත් වාසියක් වන්නේ එ දිනට සහභාගි වන
                    පරිත්‍යාගශීලීන්ගේ සංඛ්‍යාව හොඳින් අවබෝධ කර ගත හැකි වීම
                  </li>
                  <li>
                    දුරකථන සහ අන්තර්ජාල වැනි නවීන ප්‍රචාරක මාධ්‍ය වුව ද රුධිර
                    දායකයින් ගෙන්වා ගැනීමට භාවිතා කළ හැකි ය.
                  </li>
                  <li>
                    දනුවත් කිරීම සඳහා රුධිර මධ්‍යස්ථානය හෝ අදාල ලේ බැංකුව මඟින්
                    පෝස්ටර් සපයනු ලැබේ. හැකි නම් කල් වේලා ඇතිව සහ ලේ දන් දීමට
                    දින 2 - 3කට පෙර වශයෙන් දෙ වතාවක් පෝස්ටර් ප්‍රදර්ශනය කරන්න.
                    තව ද ඉලක්ක කණ්ඩායම් සඳහා අවශ්‍යතාව මත රැස්වීම්, කෙටි
                    චිත්‍රපට සහ වීඩියෝ දර්ශන සැපයීම සිදු කළ හැකි ය. මේ සියල්ල
                    සඳහා සංවිධාන කටයුතු කෙරෙන අතරතුර ලේ බැංකුව සමග සමීප
                    සම්බන්ධතාවක් තබා ගැනීමට ද අමතක නො කළ යුතුයි. එමෙන්ම ප්‍රධාන
                    සංවිධායකවරයාගේ ස්ථාවර දුරකථන අංකය සමඟ ජංගම දුරකථන අංකයක්
                    අදාල ලේ බැංකුවට ලබා දීමට කටයුතු කළ යුතුය.
                  </li>
                  <li>
                    ලේ දන් දීමේ කඳවුරක් සංවිධානය කිරීමේ දී රජය මඟින් ද විශාල
                    පිරිවැයක් දරණ බැවින්, කඳවුර සාර්ථක ව පැවැත්වීම වැදගත් වේ.
                  </li>
                </ul>
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

export default StepEight;
