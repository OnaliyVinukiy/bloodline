/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import { FooterComponent } from "./components/Footer";
import { Navigationbar } from "./components/Navbar";
import EligibilityCriteria from "./pages/eligibility/Eligibility";
import Profile from "./pages/profile/Profile";
import DonorDeclaration from "./pages/appointment/DonorDeclarations";
import Appointments from "./pages/admin/appointment/Appointments";
import PendingAppointments from "./pages/admin/appointment/PendingAppointments";
import Camps from "./pages/admin/camp/Camps";
import CalendarPage from "./pages/admin/appointment/CalendarPage";
import AppointmentDetails from "./pages/admin/appointment/AppointmentDetails";
import BloodCampRegistration from "./pages/camp/BloodCampRegistration";
import BloodDonation from "./pages/admin/appointment/BloodDonation";
import OrganizationRegistration from "./pages/organization/OrganizationRegistration";
import CampDetails from "./pages/admin/camp/CampDetails";
import DonorAppointments from "./pages/appointment/Appointments";
import Map from "./pages/camp/Map";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import AboutUs from "./pages/about/AboutUs";
import Services from "./pages/services/Services";
import ContactUs from "./pages/contact/ContactUs";
import Stock from "./pages/admin/stock/Stock";
import StockAdditionHistory from "./pages/admin/stock/StockAdditionHistory";
import StockIssueHistory from "./pages/admin/stock/StockIssueHistory";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navigationbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eligibility" element={<EligibilityCriteria />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/donorDeclaration" element={<DonorDeclaration />} />
            <Route path="/admin/appointments" element={<Appointments />} />
            <Route path="/appointment/:id" element={<AppointmentDetails />} />
            <Route path="/camp/:id" element={<CampDetails />} />
            <Route
              path="/camp-registration"
              element={<BloodCampRegistration />}
            />
            <Route
              path="/admin/pending-appointments"
              element={<PendingAppointments />}
            />
            <Route path="/admin/calendar" element={<CalendarPage />} />
            <Route
              path="/organization-registration"
              element={<OrganizationRegistration />}
            />
            <Route path="/appointments" element={<DonorAppointments />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin/camps" element={<Camps />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/stock" element={<Stock />} />
            <Route
              path="/admin/stock/addition-history"
              element={<StockAdditionHistory />}
            />
            <Route
              path="/admin/stock/issuance-history"
              element={<StockIssueHistory />}
            />
            <Route
              path="/admin/donation/:appointmentId"
              element={<BloodDonation />}
            />
          </Routes>
        </main>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
