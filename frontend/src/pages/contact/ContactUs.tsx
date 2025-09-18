/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ContactUs: React.FC = () => {
  const { t } = useTranslation("contact");

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t("contact_info_title")}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaPhone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("phone")}
                  </h3>
                  <p className="text-gray-600">(+94) 11 2 369 931</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("email")}
                  </h3>
                  <p className="text-gray-600">info@nbts.health.gov.lk</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("address")}
                  </h3>
                  <p className="text-gray-600">{t("nbts_address")}</p>
                  <p className="text-gray-600">{t("nbts_street")}</p>
                  <p className="text-gray-600">{t("nbts_city")}</p>
                  <p className="text-gray-600">{t("nbts_country")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaClock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("working_hours_title")}
                  </h3>
                  <p className="text-gray-600">{t("working_hours_mon_fri")}</p>
                  <p className="text-gray-600">{t("working_hours_sat")}</p>
                  <p className="text-gray-600">{t("working_hours_sun")}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("follow_us_title")}
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t("send_message_title")}
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("first_name_label")}
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    placeholder={t("first_name_placeholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("last_name_label")}
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    placeholder={t("last_name_placeholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("email_label")}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  placeholder={t("email_placeholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("phone_label")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  placeholder={t("phone_placeholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("subject_label")}
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                >
                  <option value="">{t("subject_placeholder")}</option>
                  <option value="donor-inquiry">{t("subject_option_1")}</option>
                  <option value="camp-organization">
                    {t("subject_option_2")}
                  </option>
                  <option value="technical-support">
                    {t("subject_option_3")}
                  </option>
                  <option value="partnership">{t("subject_option_4")}</option>
                  <option value="other">{t("subject_option_5")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("message_label")}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  placeholder={t("message_placeholder")}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-800 hover:to-red-900 transition-colors shadow-md"
              >
                {t("send_message_button")}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="h-96 w-full">
            <iframe
              title="NBTS Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.923075756286!2d79.8773907!3d6.8912169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a103d225647%3A0xef1259856066f0bf!2sNational%20Blood%20Transfusion%20Services!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("map_title")}
            </h3>
            <p className="text-gray-600">{t("map_description")}</p>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps/dir//National+Blood+Transfusion+Services,+Narahenpita,+Elvitigala+Mawatha,+Colombo/@6.8912098,79.7949888,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3ae25a103d225647:0xef1259856066f0bf!2m2!1d79.8773907!2d6.8912169?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-medium hover:underline inline-flex items-center"
              >
                <FaMapMarkerAlt className="mr-2" />
                {t("get_directions")}
              </a>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-700 rounded-xl shadow-md p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">{t("emergency_title")}</h3>
          <p className="mb-4">{t("emergency_text")}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center">
              <FaPhone className="h-5 w-5 mr-2" />
              <span className="font-semibold">{t("emergency_number")}</span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="h-5 w-5 mr-2" />
              <span className="font-semibold">{t("emergency_email")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
