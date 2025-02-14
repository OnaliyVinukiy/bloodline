import React, { useState } from "react";
import BasicInfo from "./components/basicInfo";

const DonorDeclaration = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [step, setStep] = useState(1);

  //Handle next button
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  //Handle back button
  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="mt-12">
      <div className="flex justify-center border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab1")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab1"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              English
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab2")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab2"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Sinhala
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("tab3")}
              className={`px-6 py-3 rounded-t-lg transition-colors duration-300 ${
                activeTab === "tab3"
                  ? "text-white bg-red-800 border-b-0"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Tamil
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "tab1" && (
          <BasicInfo
            step={step}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        )}
        {activeTab === "tab2" && <p>Sinhala Form</p>}
        {activeTab === "tab3" && <p>Tamil Form</p>}
      </div>
    </div>
  );
};

export default DonorDeclaration;
