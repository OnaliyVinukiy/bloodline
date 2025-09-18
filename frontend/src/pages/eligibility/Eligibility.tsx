/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import { useTranslation } from "react-i18next";

const EligibilityCriteria: React.FC = () => {
  const { t } = useTranslation("eligibility");

  const eligibilityCriteria = [
    t("criteria_1"),
    t("criteria_2"),
    t("criteria_3"),
    t("criteria_4"),
    t("criteria_5"),
    t("criteria_6"),
  ];

  const riskBehaviors = [
    t("risk_behavior_1"),
    t("risk_behavior_2"),
    t("risk_behavior_3"),
    t("risk_behavior_4"),
    t("risk_behavior_5"),
    t("risk_behavior_6"),
  ];

  const donorTypes = [
    {
      type: t("donor_type_1_type"),
      description: t("donor_type_1_description"),
      icon: "❤️",
    },
    {
      type: t("donor_type_2_type"),
      description: t("donor_type_2_description"),
      icon: "🔄",
    },
    {
      type: t("donor_type_3_type"),
      description: t("donor_type_3_description"),
      icon: "💰",
    },
    {
      type: t("donor_type_4_type"),
      description: t("donor_type_4_description"),
      icon: "🎯",
    },
  ];

  return (
    <section className="bg-gray-10 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight pb-2">
          {t("title")}
        </h1>

        <p className="mt-2 text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            {t("donor_selection_title")}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityCriteria.map((criteria, index) => (
              <li
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center">
                  <span className="text-gray-700">{criteria}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            {t("risk_behaviors_title")}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskBehaviors.map((behavior, index) => (
              <li
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">⚠️</span>
                  <span className="text-gray-700">{behavior}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            {t("donor_types_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {donorTypes.map((donor, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{donor.icon}</div>
                <h3 className="text-xl font-semibold text-red-700 mb-3">
                  {donor.type}
                </h3>
                <p className="text-gray-700">{donor.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-700 text-center"> {t("note_message")}</p>
        </div>
      </div>
    </section>
  );
};

export default EligibilityCriteria;
