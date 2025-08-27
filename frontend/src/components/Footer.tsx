/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";

import { Footer } from "flowbite-react";
import {
  FaHeartbeat,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export function FooterComponent() {
  const { t } = useTranslation("footer");

  return (
    <Footer
      container
      className="bg-gradient-to-r from-red-800 to-red-900 text-white border-t border-red-700 !rounded-none"
    >
      <div className="w-full px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Bloodline</span>
            </div>

            <p className="text-red-100 text-sm">{t("slogan")}</p>
            <div className="flex space-x-4">
              <Footer.Icon
                href="#"
                icon={FaFacebook}
                className="hover:text-red-200"
              />
              <Footer.Icon
                href="#"
                icon={FaTwitter}
                className="hover:text-red-200"
              />
              <Footer.Icon
                href="#"
                icon={FaInstagram}
                className="hover:text-red-200"
              />
              <Footer.Icon
                href="#"
                icon={FaLinkedin}
                className="hover:text-red-200"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Footer.Title
              title={t("quick_links_title")}
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("find_donation_camp")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("become_a_donor")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("register_organization")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("upcoming_blood_drives")}
              </Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Resources */}
          <div>
            <Footer.Title
              title={t("resources_title")}
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("donor_eligibility")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("donation_process")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("faqs")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("research_and_reports")}
              </Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Contact */}
          <div>
            <Footer.Title
              title={t("contact_us_title")}
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">{t("email_label")}</span>{" "}
                contact@bloodline.org
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">{t("phone_label")}</span> (+94) 11
                2 294 563
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">{t("address_label")}</span>{" "}
                Narahenpita, Colombo 05
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        <Footer.Divider className="my-8 border-red-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Footer.Copyright
            href="#"
            by={t("copyright_by")}
            year={2025}
            className="text-red-100"
          />
          <div className="mt-4 sm:mt-0">
            <Footer.LinkGroup>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("privacy_policy")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("terms_of_service")}
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                {t("cookie_policy")}
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        <div className="mt-6 p-3 bg-red-700 rounded-lg text-center">
          <p className="text-white font-bold">
            {t("emergency_title")}{" "}
            <span className="text-yellow-300">(+94) 11 2 369 931 </span>{" "}
            {t("emergency_link")}
          </p>
        </div>
      </div>
    </Footer>
  );
}
