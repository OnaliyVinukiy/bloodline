/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
"use client";

import { Footer } from "flowbite-react";

export function FooterComponent() {
  return (
    <Footer container className="mb-0 bg-gray-800 text-white !rounded-none">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            src="src/assets/bloodlogo.png"
            href="#"
            className="mr-3 h-6 sm:h-9 ml-8"
            alt="Bloodline Logo"
          >
            <span className="self-center text-white whitespace-nowrap text-xl font-semibold">
              Bloodline
            </span>
          </Footer.Brand>

          <Footer.LinkGroup className="mr-8">
            <Footer.Link href="#" className="hover:text-white">
              About
            </Footer.Link>
            <Footer.Link href="#" className="hover:text-white">
              Privacy Policy
            </Footer.Link>
            <Footer.Link href="#" className="hover:text-white">
              Licensing
            </Footer.Link>
            <Footer.Link href="#" className="hover:text-white">
              Contact
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Bloodline" year={2025} />
      </div>
    </Footer>
  );
}
