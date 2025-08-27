/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaCalendarAlt,
  FaFlask,
  FaEnvelope,
  FaUsersCog,
  FaExpand,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AboutUs: React.FC = () => {
  const { t } = useTranslation("about");

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <div className="flex items-center mb-6">
            <FaHeartbeat className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              {t("mission_title")}
            </h2>
          </div>
          <p className="text-gray-600 mb-6">{t("mission_paragraph_1")}</p>
          <p className="text-gray-600">{t("mission_paragraph_2")}</p>
        </div>

        {/* Objectives Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("objectives_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaHeartbeat className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_1_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_1_description")}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_2_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_2_description")}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaCalendarAlt className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_3_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_3_description")}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaUsersCog className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_4_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_4_description")}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaFlask className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_5_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_5_description")}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {t("objective_6_title")}
                </h3>
              </div>
              <p className="text-gray-600">{t("objective_6_description")}</p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("features_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaShieldAlt className="h-5 w-5 text-red-600 mr-2" />
                {t("feature_1_title")}
              </h3>
              <p className="text-gray-600">{t("feature_1_description")}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaExpand className="h-5 w-5 text-red-600 mr-2" />
                {t("feature_2_title")}
              </h3>
              <p className="text-gray-600">{t("feature_2_description")}</p>
            </div>
          </div>
        </div>

        {/* Future Impact Statement */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            {t("future_impact_title")}
          </h2>
          <p className="mb-6">{t("future_impact_intro")}</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>{t("future_impact_list_item_1")}</li>
            <li>{t("future_impact_list_item_2")}</li>
            <li>{t("future_impact_list_item_3")}</li>
            <li>{t("future_impact_list_item_4")}</li>
          </ul>
          <p>{t("future_impact_conclusion")}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
