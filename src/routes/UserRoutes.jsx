import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Landing from "../userPages/Landing";
import Home from "../userPages/Home";
import Buildings from "../userPages/Buildings";
import BuildingsRTL from "../userPages/Buildings-RTL";
import BuildingsNGE from "../userPages/Buildings-NGE";
import BuildingsGLE from "../userPages/Buildings-GLE";
import ReservationLibraryRoom from "../userPages/Reservation-LibraryRoom";
import ReservationParkingSlot from "../userPages/Reservation-ParkingSlot";
import UserProfile from "../userPages/UserProfile";
import About from "../userPages/About";

const UserRoutes = () => {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/rtl"
        element={
          <ProtectedRoute>
            <BuildingsRTL />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/nge"
        element={
          <ProtectedRoute>
            <BuildingsNGE />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/gle"
        element={
          <ProtectedRoute>
            <BuildingsGLE />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buildings"
        element={
          <ProtectedRoute>
            <Buildings/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations/library"
        element={
          <ProtectedRoute>
            <ReservationLibraryRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations/parking"
        element={
          <ProtectedRoute>
            <ReservationParkingSlot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default UserRoutes;
