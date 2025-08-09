import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1 rounded-md text-sm ${
          i18n.language === "en"
            ? "bg-red-800 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("si")}
        className={`px-3 py-1 rounded-md text-sm ${
          i18n.language === "si"
            ? "bg-red-800 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        සිංහල
      </button>
    </div>
  );
};

export default LanguageSwitcher;
