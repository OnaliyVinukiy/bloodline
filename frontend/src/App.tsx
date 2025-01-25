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
import { Login } from "./pages/home/components/Login";
import EligibilityCriteria  from "./pages/eligibility/Eligibility";
import { useState } from "react";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  return (
    <Router>
      <Navigationbar
        onLoginClick={() => setOpenModal(true)}
        user={user}
        onLogout={() => setUser(null)}
      />
      <Login
        openModal={openModal}
        onCloseModal={() => setOpenModal(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eligibility" element={<EligibilityCriteria />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;
