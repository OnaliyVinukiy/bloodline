import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import { FooterComponent } from "./components/common/Footer";
import { Navigationbar } from "./components/common/Navbar";
import { Login } from "./pages/home/components/Login";
import { useState } from "react";

function App() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Router>
      <Navigationbar onLoginClick={() => setOpenModal(true)} />
      <Login openModal={openModal} onCloseModal={() => setOpenModal(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;
