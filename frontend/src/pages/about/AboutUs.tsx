/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaCalendarAlt,
  FaFlask,
  FaEnvelope,
  FaUsersCog,
  FaExpand,
} from "react-icons/fa";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight">
            About Bloodline
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Revolutionizing blood donation management for the National Blood
            Transfusion Service of Sri Lanka
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <div className="flex items-center mb-6">
            <FaHeartbeat className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 mb-6">
            The Bloodline Blood Bank Management System was developed to address
            the challenges faced by the NBTS, blood donors, and blood donation
            camp organizers. Our platform bridges the gap between donors and
            recipients while streamlining operations for the National Blood
            Transfusion Service.
          </p>
          <p className="text-gray-600">
            Through innovative technology and user-centered design, we're
            transforming Sri Lanka's blood donation ecosystem to ensure no
            patient suffers from blood shortage.
          </p>
        </div>

        {/* Objectives Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Key Objectives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaHeartbeat className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Intuitive Platform
                </h3>
              </div>
              <p className="text-gray-600">
                Designed with special attention to user experience for both
                tech-savvy and non-technical users, ensuring seamless navigation
                and minimal effort to access features.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Secure Database
                </h3>
              </div>
              <p className="text-gray-600">
                Built on Azure and Asgardeo with enterprise-grade security
                including data encryption, access controls, and secure
                authentication to protect sensitive donor information.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaCalendarAlt className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Appointment System
                </h3>
              </div>
              <p className="text-gray-600">
                Robust online booking reduces waiting times by allowing donors
                to select convenient slots, while enabling NBTS to manage
                appointment requests efficiently.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaUsersCog className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Camp Management
                </h3>
              </div>
              <p className="text-gray-600">
                Streamlines camp organization with online registration, NBTS
                approval workflows, and medical team allocation - eliminating
                paperwork and delays.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaFlask className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Stock Management
                </h3>
              </div>
              <p className="text-gray-600">
                Comprehensive tracking of blood stock levels with complete
                history of additions and issuances, ensuring optimal inventory
                management at NBTS.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Notification System
                </h3>
              </div>
              <p className="text-gray-600">
                Automated emails keep donors engaged with updates on local
                campaigns and appointment confirmations, while camp organizers
                receive camp approval notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            System Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaShieldAlt className="h-5 w-5 text-red-600 mr-2" />
                Role-Based Access Control
              </h3>
              <p className="text-gray-600">
                Strict access control enforced through WSO2 Asgardeo ensures
                only authorized personnel have appropriate system privileges,
                maintaining healthcare data security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaExpand className="h-5 w-5 text-red-600 mr-2" />
                Future-Ready Architecture
              </h3>
              <p className="text-gray-600">
                Designed with scalability in mind, the system can easily
                accommodate new features, increased user loads, and integration
                with other healthcare systems as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Future Impact Statement */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-xl shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            The Future of Blood Donation in Sri Lanka
          </h2>
          <p className="mb-6">
            Bloodline is designed to revolutionize how NBTS manages blood
            donations, with anticipated improvements in:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Streamlining donor registration and appointment processes</li>
            <li>Reducing administrative burdens for NBTS staff</li>
            <li>Improving blood stock visibility across all centers</li>
            <li>Enhancing donor engagement and retention</li>
          </ul>
          <p>
            By implementing this system, NBTS will be better equipped to meet
            Sri Lanka's blood supply needs through modern, technology-driven
            solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
