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

export function FooterComponent() {
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

            <p className="text-red-100 text-sm">
              Saving lives through blood donation. Join our mission to ensure no
              one suffers from blood shortage.
            </p>
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
              title="Quick Links"
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Find a Donation Camp
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Become a Donor
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Register Your Organization
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Upcoming Blood Drives
              </Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Resources */}
          <div>
            <Footer.Title
              title="Resources"
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Donor Eligibility
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Blood Donation Process
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                FAQs
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Research & Reports
              </Footer.Link>
            </Footer.LinkGroup>
          </div>

          {/* Contact */}
          <div>
            <Footer.Title
              title="Contact Us"
              className="text-white text-lg font-bold mb-4"
            />
            <Footer.LinkGroup col className="space-y-2">
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">Email:</span>{" "}
                contact@bloodline.org
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">Phone:</span> (+94) 11 2 294 563
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                <span className="font-medium">Address:</span> Narahenpita,
                Colombo 05
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        <Footer.Divider className="my-8 border-red-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Footer.Copyright
            href="#"
            by="Bloodline Blood Bank Management System"
            year={2025}
            className="text-red-100"
          />
          <div className="mt-4 sm:mt-0">
            <Footer.LinkGroup>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Privacy Policy
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Terms of Service
              </Footer.Link>
              <Footer.Link href="#" className="text-red-100 hover:text-white">
                Cookie Policy
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="mt-6 p-3 bg-red-700 rounded-lg text-center">
          <p className="text-white font-bold">
            In case of emergency, call{" "}
            <span className="text-yellow-300">(+94) 11 2 369 931 </span> or
            visit your nearest hospital.
          </p>
        </div>
      </div>
    </Footer>
  );
}
