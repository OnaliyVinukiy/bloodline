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
import DonorDonations from "./pages/appointment/Donations";
import ContactUs from "./pages/contact/ContactUs";
import OrganizedCamps from "./pages/camp/Camps";
import Organizations from "./pages/admin/organization/Organizations";
import Stock from "./pages/admin/stock/Stock";
import BloodTesting from "./pages/admin/appointment/BloodTesting";
import StockAdditionHistory from "./pages/admin/stock/StockAdditionHistory";
import StockIssueHistory from "./pages/admin/stock/StockIssueHistory";
import Donors from "./pages/admin/donor/Donors";
import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { UserProvider } from "./contexts/UserContext";
import HospitalRegistration from "./pages/hospital/HospitalRegistration";
import Hospitals from "./pages/admin/hospital/Hospitals";
import HospitalBloodRequest from "./pages/hospital/RequestBlood";
import BloodRequests from "./pages/admin/hospital/BloodRequests";

function App() {
  const { state } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [state?.isAuthenticated]);

  if (isLoading) {
    return (
      <div className="loading flex justify-center items-center h-screen">
        <svg width="64px" height="48px">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
            stroke="#e53e3e"
            strokeWidth="2"
            fill="none"
          ></polyline>
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
            stroke="#f56565"
            strokeWidth="2"
            fill="none"
          ></polyline>
        </svg>
      </div>
    );
  }

  return (
    <UserProvider>
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

              <Route path="/admin/calendar" element={<CalendarPage />} />
              <Route
                path="/organization-registration"
                element={<OrganizationRegistration />}
              />
              <Route path="/appointments" element={<DonorAppointments />} />
              <Route path="/donations" element={<DonorDonations />} />
              <Route path="/map" element={<Map />} />
              <Route path="/organized-camps" element={<OrganizedCamps />} />
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
              <Route
                path="/admin/testing/:appointmentId"
                element={<BloodTesting />}
              />
              <Route path="/admin/organizations" element={<Organizations />} />
              <Route path="/admin/donors" element={<Donors />} />
              <Route
                path="/hospital-registration"
                element={<HospitalRegistration />}
              />
              <Route path="/admin/hospitals" element={<Hospitals />} />
              <Route
                path="/hospital/request-blood"
                element={<HospitalBloodRequest />}
              />
              <Route path="/admin/blood-requests" element={<BloodRequests />} />
            </Routes>
          </main>
          <FooterComponent />
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
