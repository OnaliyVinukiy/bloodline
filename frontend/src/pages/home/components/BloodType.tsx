/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
const BloodType: React.FC = () => {
  const bloodTypes = [
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/apositive.png",
      alt: "Blood Type A+",
      text: "One of the most common blood types and is in high demand for transfusions.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/anegative.png",
      alt: "Blood Type A-",
      text: "A rare blood type but can be given to A-, A+, AB-, and AB+ patients.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/bpositive.png",
      alt: "Blood Type B+",
      text: "A relatively common blood type, making up around 8% of the global population.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/bnegative.png",
      alt: "Blood Type B-",
      text: "One of the rarest blood types, found in only about 2% of people.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/opositive.png",
      alt: "Blood Type O+",
      text: "The most common blood type and is widely used in emergency transfusions.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/onegative.png",
      alt: "Blood Type O-",
      text: "The universal donor blood type, meaning it can be given to any patient.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/abpositive.png",
      alt: "Blood Type AB+",
      text: "The universal recipient for red blood cells and is rare but valuable for plasma donations.",
    },
    {
      src: "https://bloodlineresources.blob.core.windows.net/assets/abnegative.png",
      alt: "Blood Type AB-",
      text: "The rarest blood type and is the universal donor for plasma transfusions.",
    },
  ];

  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-auto lg:h-[700px] flex items-center mt-28 mb-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://bloodlineresources.blob.core.windows.net/assets/bloodinventory.jpg')`,
      }}
    >
      <div className="px-4 mx-auto max-w-screen-xl text-center py-12 lg:py-24">
        <h1 className="mb-4 text-3xl font-extrabold font-roboto tracking-tight leading-none text-white sm:text-4xl lg:text-5xl">
          Blood Type Information
        </h1>

        <p className="mb-8 text-base font-normal text-gray-300 sm:text-lg lg:text-xl sm:px-6 lg:px-48">
          Learn about different blood types and their importance in
          transfusions.
          <br />
          Hover over each blood type to see its significance.
        </p>

        {/* Blood Type Cards in a Single Horizontal Row */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {bloodTypes.map((blood, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center"
            >
              <img
                src={blood.src}
                alt={blood.alt}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-[-4rem] sm:bottom-[-5rem] w-52 bg-black text-white text-xs sm:text-sm px-3 py-2 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                {blood.text}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 sm:mt-16">
          <a
            href="/map"
            className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-lg font-medium text-white bg-red-800 rounded-lg shadow-md hover:bg-red-700 focus:ring-4 focus:ring-red-300 relative"
          >
            Find a Donation Camp
          </a>
        </div>
      </div>
    </section>
  );
};

export default BloodType;
