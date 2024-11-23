import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../adminPages/AdminDashboard";
import AnalyticsForms from "../adminPages/Analytics";
import Buildings from "../adminPages/Buildings";
import ParkingLot from "../adminPages/ParkingLot";
import ParkingReservations from "../adminPages/ParkingReservation";
import Rooms from "../adminPages/Rooms";
import Library from "../adminPages/Library";
import LibraryReservations from "../adminPages/LibraryReservation";
import Schedule from "../adminPages/Schedule";
import Subjects from "../adminPages/Subjects";
import TimeSlot from "../adminPages/TimeSlot";
import Users from "../adminPages/Users";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<WelcomeToDashboard />} />
        <Route path="analytics" element={<AnalyticsForms />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="library" element={<Library />} />
        <Route path="parking-reservations" element={<ParkingReservations />} />
        <Route path="parking-lot" element={<ParkingLot />} />
        <Route path="library-reservations" element={<LibraryReservations />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="timeslot" element={<TimeSlot />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

const WelcomeToDashboard = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
    </div>
  );
};

export default AdminRoutes;
