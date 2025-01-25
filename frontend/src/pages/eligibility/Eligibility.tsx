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
      </div>
    </section>
  );
};

export default EligibilityCriteria;
