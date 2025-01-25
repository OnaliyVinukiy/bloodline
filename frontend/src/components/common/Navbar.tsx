/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

"use client";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";

export function Navigationbar({
  onLoginClick,
  user,
  onLogout,
}: {
  onLoginClick: () => void;
  user: { name: string; email: string; avatar: string } | null;
  onLogout: () => void;
}) {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand
        href="https://flowbite-react.com"
        className="md:ml-24 h-6 sm:h-9"
      >
        <img
          src="src/assets/bloodlogo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Bloodline Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Bloodline
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 md:mr-24">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={user.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button
            className="bg-red-800 hover:bg-red-700 text-white"
            onClick={onLoginClick}
          >
            Login
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" className="text-lg font-medium" active>
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
