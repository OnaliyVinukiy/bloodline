/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React from "react";
const Map: React.FC = () => {
  const bloodTypes = [
    {
      src: "src/assets/apositive.png",
      alt: "Blood Type A+",
      text: "When the stock is over 10 days, A+ is needed less. When the stock for A+ is below 8 days, A+ is especially important.",
    },
    {
      src: "src/assets/anegative.png",
      alt: "Blood Type A-",
      text: "When the stock is over 10 days, A- is needed less. When the stock for A- is below 8 days, A- is especially important.",
    },
    {
      src: "src/assets/bpositive.png",
      alt: "Blood Type B+",
      text: "When the stock is over 10 days, B+ is needed less. When the stock for B+ is below 8 days, B+ is especially important.",
    },
    {
      src: "src/assets/bnegative.png",
      alt: "Blood Type B-",
      text: "When the stock is over 10 days, B- is needed less. When the stock for B- is below 8 days, B- is especially important.",
    },
    {
      src: "src/assets/opositive.png",
      alt: "Blood Type O+",
      text: "When the stock is over 10 days, O+ is needed less. When the stock for O+ is below 8 days, O+ is especially important.",
    },
    {
      src: "src/assets/onegative.png",
      alt: "Blood Type O-",
      text: "When the stock is over 10 days, O- is needed less. When the stock for O- is below 8 days, O- is especially important.",
    },
    {
      src: "src/assets/abpositive.png",
      alt: "Blood Type AB+",
      text: "When the stock is over 10 days, AB+ is needed less. When the stock for AB+ is below 8 days, AB+ is especially needed.",
    },
    {
      src: "src/assets/abnegative.png",
      alt: "Blood Type AB-",
      text: "When the stock is over 10 days, AB- is needed less. When the stock for AB- is below 8 days, AB- is especially needed.",
    },
  ];

  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-auto lg:h-[700px] flex items-center mt-28 mb-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('src/assets/bloodinventory.jpg')`,
      }}
    >
      <div className="px-4 mx-auto max-w-screen-xl text-center py-12 lg:py-24">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-white sm:text-4xl lg:text-5xl">
          National Blood Inventory
        </h1>

        <p className="mb-8 text-base font-normal text-gray-300 sm:text-lg lg:text-xl sm:px-6 lg:px-48">
          The National Blood Transfusion Service manages the blood supply to all
          provinces of Sri Lanka.
          <br />
          Below is a summary of the current stock levels of all blood types.
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
              <div className="absolute bottom-[-6rem] sm:bottom-[-8rem] w-52 bg-black text-white text-xs sm:text-sm px-3 py-2 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                {blood.text}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 sm:mt-16">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-lg font-medium text-white bg-red-800 rounded-lg shadow-md hover:bg-red-700 focus:ring-4 focus:ring-red-300"
          >
            Find a Donation Centre
          </a>
        </div>
      </div>
    </section>
  );
};

export default Map;
