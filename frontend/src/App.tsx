/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import { FooterComponent } from "./components/common/Footer";
import { Navigationbar } from "./components/common/Navbar";
import EligibilityCriteria from "./pages/eligibility/Eligibility";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Router>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eligibility" element={<EligibilityCriteria />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;
