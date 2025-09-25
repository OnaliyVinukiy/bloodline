/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { FooterComponent } from "./components/Footer";
import { Navigationbar } from "./components/Navbar";
import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { UserProvider } from "./contexts/UserContext";

// Lazy load components
const Home = lazy(() => import("./pages/home/Home"));
const EligibilityCriteria = lazy(
  () => import("./pages/eligibility/Eligibility")
);
const Profile = lazy(() => import("./pages/profile/Profile"));
const DonorDeclaration = lazy(
  () => import("./pages/appointment/DonorDeclarations")
);
const Appointments = lazy(
  () => import("./pages/admin/appointment/Appointments")
);
const Camps = lazy(() => import("./pages/admin/camp/Camps"));
const CalendarPage = lazy(
  () => import("./pages/admin/appointment/CalendarPage")
);
const AppointmentDetails = lazy(
  () => import("./pages/admin/appointment/AppointmentDetails")
);
const BloodCampRegistration = lazy(
  () => import("./pages/camp/BloodCampRegistration")
);
const BloodDonation = lazy(
  () => import("./pages/admin/appointment/BloodDonation")
);
const OrganizationRegistration = lazy(
  () => import("./pages/organization/OrganizationRegistration")
);
const CampDetails = lazy(() => import("./pages/admin/camp/CampDetails"));
const DonorAppointments = lazy(
  () => import("./pages/appointment/Appointments")
);
const Map = lazy(() => import("./pages/camp/Map"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const AboutUs = lazy(() => import("./pages/about/AboutUs"));
const Services = lazy(() => import("./pages/services/Services"));
const DonorDonations = lazy(() => import("./pages/appointment/Donations"));
const ContactUs = lazy(() => import("./pages/contact/ContactUs"));
const OrganizedCamps = lazy(() => import("./pages/camp/Camps"));
const Organizations = lazy(
  () => import("./pages/admin/organization/Organizations")
);
const Stock = lazy(() => import("./pages/admin/stock/Stock"));
const BloodTesting = lazy(
  () => import("./pages/admin/appointment/BloodTesting")
);
const StockAdditionHistory = lazy(
  () => import("./pages/admin/stock/StockAdditionHistory")
);
const StockIssueHistory = lazy(
  () => import("./pages/admin/stock/StockIssueHistory")
);
const Donors = lazy(() => import("./pages/admin/donor/Donors"));
const HospitalRegistration = lazy(
  () => import("./pages/hospital/HospitalRegistration")
);
const Hospitals = lazy(() => import("./pages/admin/hospital/Hospitals"));
const HospitalBloodRequest = lazy(
  () => import("./pages/hospital/RequestBlood")
);
const BloodRequests = lazy(
  () => import("./pages/admin/hospital/BloodRequests")
);

// Loading component
const LoadingSpinner = () => (
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
    return <LoadingSpinner />;
  }

  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          <Navigationbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/eligibility" element={<EligibilityCriteria />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/donorDeclaration"
                  element={<DonorDeclaration />}
                />
                <Route path="/admin/appointments" element={<Appointments />} />
                <Route
                  path="/appointment/:id"
                  element={<AppointmentDetails />}
                />
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
                <Route
                  path="/admin/organizations"
                  element={<Organizations />}
                />
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
                <Route
                  path="/admin/blood-requests"
                  element={<BloodRequests />}
                />
              </Routes>
            </Suspense>
          </main>
          <FooterComponent />
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
