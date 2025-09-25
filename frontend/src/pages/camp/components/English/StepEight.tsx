/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

import React from "react";
import { StepperPropsCamps } from "../../../../types/stepper";
import { useTranslation } from "react-i18next";

const StepEight: React.FC<StepperPropsCamps> = ({
  onNextStep,
  onPreviousStep,
}) => {
  const { t } = useTranslation("campDonors");

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
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  {t("title")}
                </h2>
              </div>
              <div className="mt-2 text-lg md:text-xl text-gray-600">
                {t("subtitle")}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="mt-4 mb-8 font-roboto font-medium text-md md:text-xl text-left text-gray-700 leading-relaxed">
                {t("description_part1")}
                <br />
                <br />
                {t("description_part2")}
                <ul className="list-disc pl-6 mt-6 space-y-4">
                  <li>
                    {t("list_item_1_part1")}
                    <strong className="text-red-700">
                      {t("list_item_1_bold_1")}
                    </strong>
                    {t("list_item_1_part2")}
                    <strong className="text-red-700">
                      {t("list_item_1_bold_2")}
                    </strong>
                    {t("list_item_1_part3")}
                    <strong className="text-red-700">
                      {t("list_item_1_bold_3")}
                    </strong>
                    {t("list_item_1_part4")}
                  </li>
                  <li>
                    {t("list_item_2_part1")}
                    <strong className="text-red-700">
                      {t("list_item_2_bold_1")}
                    </strong>
                    {t("list_item_2_part2")}
                  </li>
                  <li>{t("list_item_3")}</li>
                  <li>
                    {t("list_item_4_part1")}
                    <strong className="text-red-700">
                      {t("list_item_4_bold_1")}
                    </strong>
                    {t("list_item_4_part2")}
                    <strong className="text-red-700">
                      {t("list_item_4_bold_2")}
                    </strong>
                    {t("list_item_4_part3")}
                  </li>
                  <li>
                    {t("list_item_5_part1")}
                    <strong className="text-red-700">
                      {t("list_item_5_bold_1")}
                    </strong>
                    {t("list_item_5_part2")}
                    <strong className="text-red-700">
                      {t("list_item_5_bold_2")}
                    </strong>
                    {t("list_item_5_part3")}
                  </li>
                  <li>
                    {t("list_item_6_part1")}
                    <strong className="text-red-700">
                      {t("list_item_6_bold_1")}
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      {t("list_item_6_bold_2")}
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      {t("list_item_6_bold_3")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_6_bold_4")}
                    </strong>
                    {t("list_item_6_part2")}
                  </li>
                  <li>
                    {t("list_item_7_part1")}
                    <strong className="text-red-700">
                      {t("list_item_7_bold_1")}
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      {t("list_item_7_bold_2")}
                    </strong>
                    {t("list_item_7_part2")}
                  </li>
                  <li>
                    {t("list_item_8_part1")}
                    <strong className="text-red-700">
                      {t("list_item_8_bold_1")}
                    </strong>
                    {t("list_item_8_part2")}
                    <strong className="text-red-700">
                      {t("list_item_8_bold_2")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_8_bold_3")}
                    </strong>
                    {t("list_item_8_part3")}
                    <strong className="text-red-700">
                      {t("list_item_8_bold_4")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_8_bold_5")}
                    </strong>
                    {t("list_item_8_part4")}
                  </li>
                  <li>
                    {t("list_item_9_part1")}
                    <strong className="text-red-700">
                      {t("list_item_9_bold_1")}
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      {t("list_item_9_bold_2")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_9_bold_3")}
                    </strong>
                    {t("list_item_9_part2")}
                  </li>
                  <li>{t("list_item_10_part1")}</li>
                  <li>{t("list_item_11_part1")}</li>
                  <li>
                    {t("list_item_12_part1")}
                    <strong className="text-red-700">
                      {t("list_item_12_bold_1")}
                    </strong>
                    {t("list_item_12_part2")}
                  </li>
                  <li>
                    {t("list_item_13_part1")}
                    <strong className="text-red-700">
                      {t("list_item_13_bold_1")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_13_bold_2")}
                    </strong>
                    {t("list_item_13_part2")}
                  </li>
                  <li>
                    {t("list_item_14_part1")}
                    <strong className="text-red-700">
                      {t("list_item_14_bold_1")}
                    </strong>
                    {t("list_item_14_part2")}
                    <strong className="text-red-700">
                      {t("list_item_14_bold_2")}
                    </strong>
                    {t("list_item_14_part3")}
                  </li>
                  <li>
                    {t("list_item_15_part1")}
                    <strong className="text-red-700">
                      {t("list_item_15_bold_1")}
                    </strong>
                    ,{" "}
                    <strong className="text-red-700">
                      {t("list_item_15_bold_2")}
                    </strong>
                    , and{" "}
                    <strong className="text-red-700">
                      {t("list_item_15_bold_3")}
                    </strong>
                    {t("list_item_15_part2")}
                  </li>
                  <li>
                    {t("list_item_16_part1")}
                    <strong className="text-red-700">
                      {t("list_item_16_bold_1")}
                    </strong>
                    , and a{" "}
                    <strong className="text-red-700">
                      {t("list_item_16_bold_2")}
                    </strong>
                    {t("list_item_16_part2")}
                  </li>
                  <li>
                    {t("list_item_17_part1")}
                    <strong className="text-red-700">
                      {t("list_item_17_bold_1")}
                    </strong>
                    {t("list_item_17_part2")}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className="text-red-800 hover:text-white border border-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
              >
                {t("back_button")}
              </button>
              <button
                onClick={handleNext}
                className="focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-800 hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300"
              >
                {t("next_button")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StepEight;
