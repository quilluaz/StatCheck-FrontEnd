import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Landing from "../userPages/Landing";
import Home from "../userPages/Home";
import Buildings from "../userPages/Buildings";
import BuildingsRTL from "../userPages/Buildings-RTL";
import BuildingsNGE from "../userPages/Buildings-NGE";
import BuildingsGLE from "../userPages/Buildings-GLE";
import Reservation from "../userPages/Reservation";
import ReservationLibraryRoom from "../userPages/Reservation-LibraryRoom";
import ReservationParkingSlot from "../userPages/Reservation-ParkingSlot";
import UserProfile from "../userPages/UserProfile";
import Settings from "../userPages/Settings";
import About from "../userPages/About";

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
