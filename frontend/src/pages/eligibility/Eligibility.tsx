/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";

const EligibilityCriteria: React.FC = () => {
  const eligibilityCriteria = [
    "Age above 18 years and below 60 years.",
    "If previously donated, at least 4 months should be elapsed since the date of previous donation.",
    "Hemoglobin level should be more than 12g/dL. (this blood test is done prior to each blood donation)",
    "Free from any serious disease condition or pregnancy.",
    "Should have a valid identity card or any other document to prove the identity.",
    "Free from 'Risk Behaviors'.",
  ];

  const riskBehaviors = [
    "Homosexuals.",
    "Sex workers.",
    "Clients of sex workers",
    "Drug addicts.",
    "Engaging in sex with any of the above.",
    "Having more than one sexual partner.",
  ];

  const donorTypes = [
    {
      type: "Voluntary non-remunerated donors",
      description:
        "Donate for the sake of others and do not expect any benefit. Their blood is considered safe and healthy.",
      icon: "❤️",
    },
    {
      type: "Replacement donors",
      description:
        "Donate to replace the units used for their friends or family members. Not accepted by NBTS.",
      icon: "🔄",
    },
    {
      type: "Paid donors",
      description: "Receive payment for donation. Not accepted by NBTS.",
      icon: "💰",
    },
    {
      type: "Directed donors",
      description:
        "Donate only for a specific patient’s requirement. Used in certain conditions such as in rare blood groups.",
      icon: "🎯",
    },
  ];

  return (
    <section className="bg-white to-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Fixed h1 with adjusted line-height and padding */}
        <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight pb-2">
          Blood Donation Eligibility Criteria
        </h1>

        <p className="mt-2 text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
          The criteria below ensure the safety of both the donor and the quality
          of the donated blood.
        </p>

        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            Donor Selection Criteria
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
            Risk Behaviors
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
            Types of Donors
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

        <p className="mt-12 text-center text-gray-700 text-lg">
          NBTS achieved the mighty figure of 100% voluntary non-remunerated
          blood donor base.
        </p>
      </div>
    </section>
  );
};

export default EligibilityCriteria;
