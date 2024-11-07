import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import Buildings from "../pages/Buildings";
import BuildingsRTL from "../pages/Buildings-RTL";
import BuildingsNGE from "../pages/Buildings-NGE";
import BuildingsGLE from "../pages/Buildings-GLE";
import Reservation from "../pages/Reservation";
import ReservationLibraryRoom from "../pages/Reservation-LibraryRoom";
import ReservationParkingSlot from "../pages/Reservation-ParkingSlot";
import UserProfile from "../pages/UserProfile";
import Settings from "../pages/Settings";
import About from "../pages/About";

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/buildings-rtl" element={<BuildingsRTL />} />
        <Route path="/buildings-nge" element={<BuildingsNGE />} />
        <Route path="/buildings-gle" element={<BuildingsGLE />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route
          path="/reservation-library"
          element={<ReservationLibraryRoom />}
        />
        <Route
          path="/reservation-parking"
          element={<ReservationParkingSlot />}
        />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
