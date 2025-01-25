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
    "Sex workers and their clients.",
    "Drug addicts.",
    "Engaging in sex with any of the above.",
    "Having more than one sexual partner.",
  ];

  const donorTypes = [
    {
      type: "Voluntary non-remunerated donors",
      description:
        "Donate for the sake of others and do not expect any benefit. Their blood is considered safe and healthy.",
    },
    {
      type: "Replacement donors",
      description:
        "Donate to replace the units used for their friends or family members. Not accepted by NBTS.",
    },
    {
      type: "Paid donors",
      description: "Receive payment for donation. Not accepted by NBTS.",
    },
    {
      type: "Directed donors",
      description:
        "Donate only for a specific patient’s requirement. Used in certain conditions such as in rare blood groups.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-800">
          Blood Donation Eligibility Criteria
        </h1>

        <p className="text-lg text-gray-700 text-center mb-12">
          The criteria below ensure the safety of both the donor and the quality
          of the donated blood.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Donor Selection Criteria
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {eligibilityCriteria.map((criteria, index) => (
              <li key={index}>{criteria}</li>
            ))}
          </ul>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Risk Behaviors
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {riskBehaviors.map((behavior, index) => (
              <li key={index}>{behavior}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Types of Donors
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {donorTypes.map((donor, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  {donor.type}
                </h3>
                <p className="text-gray-700">{donor.description}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 text-center text-gray-700">
          NBTS achieved the mighty figure of 100% voluntary non-remunerated
          blood donor base.
        </p>
      </div>
    </section>
  );
};

export default EligibilityCriteria;
