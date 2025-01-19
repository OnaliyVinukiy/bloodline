/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

"use client";
import { Button, Navbar } from "flowbite-react";
export function Navigationbar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand
        href="https://flowbite-react.com"
        className="md:ml-24 h-6 sm:h-9"
      >
        <img
          src="src/assets/bloodlogo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Bloodline
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 md:mr-24">
        <Button className="bg-red-800">Login</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" className="text-lg font-medium" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          About
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Services
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Appointments
        </Navbar.Link>
        <Navbar.Link href="#" className="text-lg font-medium">
          Contact Us
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
