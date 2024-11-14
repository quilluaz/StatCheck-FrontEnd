import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../userPages/Landing";
import Home from "../userPages/Home";
// import Buildings from "../userPages/Buildings";
import BuildingsRTL from "../userPages/Buildings-RTL";
import BuildingsNGE from "../userPages/Buildings-NGE";
import BuildingsGLE from "../userPages/Buildings-GLE";
// import Reservation from "../userPages/Reservation";
import ReservationLibraryRoom from "../userPages/Reservation-LibraryRoom";
import ReservationParkingSlot from "../userPages/Reservation-ParkingSlot";
import UserProfile from "../userPages/UserProfile";
import About from "../userPages/About";

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/buildings" element={<Buildings />} /> */}
        <Route path="/buildings/rtl" element={<BuildingsRTL />} />
        <Route path="/buildings/nge" element={<BuildingsNGE />} />
        {<Route path="/buildings/gle" element={<BuildingsGLE />} />}
        {/* <Route path="/reservations" element={<Reservation />} /> */}
        <Route
          path="/reservations/library"
          element={<ReservationLibraryRoom />}
        />
        <Route
          path="/reservations/parking"
          element={<ReservationParkingSlot />}
        />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
