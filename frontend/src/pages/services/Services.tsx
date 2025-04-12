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

const Services: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions designed to transform blood donation
            management for the National Blood Transfusion Service of Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Donor Services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-red-700 p-4 text-white">
              <div className="flex items-center">
                <FaUsers className="h-8 w-8 mr-3" />
                <h2 className="text-xl font-bold">Donor Services</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCalendarAlt className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Online Appointment Booking
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Schedule donations at your convenience with our
                      easy-to-use booking system
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <GiHealthIncrease className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Donor Health Tracking
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Maintain your donation history and track eligibility
                      periods
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email Notifications
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Receive emails about appointment status and appointment
                      reminders
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
                <h2 className="text-xl font-bold">NBTS Services</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaChartLine className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Real-time Inventory Management
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Add, issue and track current blood stock levels available
                      for each blood type
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaUsers className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Donor Database Management
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Maintain comprehensive donor records with advanced
                      filtering capabilities
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaShieldAlt className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Secure Data Handling
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Enterprise-grade security for all sensitive donor and
                      inventory data
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
                <h2 className="text-xl font-bold">Camp Services</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaUsers className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Online Camp Registration
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Easily organize and register blood donation camps through
                      our platform
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Donor Email Notifications
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Donors receive email notifications about camp schedules
                      and updates
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaBell className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email Notifications
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Receive email notifications about camp acceptance or
                      rejection
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
            Integrated System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Role-Based Access Control
                </h3>
                <p className="text-gray-600">
                  Secure, granular permissions ensuring only authorized
                  personnel can access specific system functions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaBell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Automated Notifications
                </h3>
                <p className="text-gray-600">
                  Timely alerts for appointment confirmations, rejections,
                  reminders, and camp updates
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaChartLine className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Important Statistics
                </h3>
                <p className="text-gray-600">
                  Provide important statistics about donors, organizations,
                  appointments, camps and stock to NBTS for decision making
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Blood Donation Management?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Discover how Bloodline can streamline your blood donation processes,
            whether you're a donor, NBTS administrator, or camp organizer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
