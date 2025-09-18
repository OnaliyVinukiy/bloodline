/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaFlask,
  FaBell,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import { GiHealthIncrease } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const Services: React.FC = () => {
  const { t } = useTranslation("services");

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Donor Services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-red-700 p-4 text-white">
              <div className="flex items-center">
                <FaUsers className="h-8 w-8 mr-3" />
                <h2 className="text-xl font-bold">
                  {t("donor_services_title")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCalendarAlt className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("online_booking_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("online_booking_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <GiHealthIncrease className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("health_tracking_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("health_tracking_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("donor_notifications_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("donor_notifications_description")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* NBTS Services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-red-700 p-4 text-white">
              <div className="flex items-center">
                <FaFlask className="h-8 w-8 mr-3" />
                <h2 className="text-xl font-bold">
                  {t("nbts_services_title")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaChartLine className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("inventory_management_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("inventory_management_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaUsers className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("donor_db_management_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("donor_db_management_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaShieldAlt className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("secure_data_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("secure_data_description")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Camp Organizer Services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-red-700 p-4 text-white">
              <div className="flex items-center">
                <FaCalendarAlt className="h-8 w-8 mr-3" />
                <h2 className="text-xl font-bold">
                  {t("camp_services_title")}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaUsers className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("online_camp_registration_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("online_camp_registration_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("camp_notifications_donors_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("camp_notifications_donors_description")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {t("camp_notifications_orgs_title")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("camp_notifications_orgs_description")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integrated Features */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("integrated_features_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("role_based_access_title")}
                </h3>
                <p className="text-gray-600">
                  {t("role_based_access_description")}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaBell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("automated_notifications_title")}
                </h3>
                <p className="text-gray-600">
                  {t("automated_notifications_description")}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaChartLine className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("important_stats_title")}
                </h3>
                <p className="text-gray-600">
                  {t("important_stats_description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{t("cta_title")}</h2>
          <p className="mb-6 max-w-2xl mx-auto">{t("cta_subtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              {t("cta_button")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
