import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-full p-1 bg-white shadow-sm">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          i18n.language === "en"
            ? "bg-red-700 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("si")}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          i18n.language === "si"
            ? "bg-red-700 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        සිංහල
      </button>
    </div>
  );
};

export default LanguageSwitcher;
