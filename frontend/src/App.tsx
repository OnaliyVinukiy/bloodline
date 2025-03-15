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
import Appointments from "./pages/admin/Appointments";
import PendingAppointments from "./pages/admin/PendingAppointments";
import CalendarPage from "./pages/admin/CalendarPage";
import AppointmentDetails from "./pages/admin/AppointmentDetails";
import BloodCampaignRegistration from "./pages/campaign/BloodCampRegistration";

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
            <Route path="/donorDeclaration" element={<DonorDeclaration />} />
            <Route path="/admin/appointments" element={<Appointments />} />
            <Route path="/appointment/:id" element={<AppointmentDetails />} />
            <Route
              path="/campaign-registration"
              element={<BloodCampaignRegistration />}
            />
            <Route
              path="/admin/pending-appointments"
              element={<PendingAppointments />}
            />
            <Route path="/admin/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
