import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
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
  const { user } = useAuth();
  
  if (user && user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }>
        <Route
          index
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <WelcomeToDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AnalyticsForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="buildings"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Buildings />
            </ProtectedRoute>
          }
        />
        <Route
          path="library"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="parking-reservations"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ParkingReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="parking-lot"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ParkingLot />
            </ProtectedRoute>
          }
        />
        <Route
          path="library-reservations"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <LibraryReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="rooms"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="schedule"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="timeslot"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <TimeSlot />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Users />
            </ProtectedRoute>
          }
        />
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
