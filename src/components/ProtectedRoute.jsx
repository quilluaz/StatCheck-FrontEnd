import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log("User state changed:", user);
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        navigate("/", { state: { from: location.pathname }, replace: true });
      } else if (requiredRole && user?.role !== requiredRole) {
        const redirectPath = user?.role === "ADMIN" ? "/admin" : "/home";
        console.log(`User role mismatch, redirecting to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, requiredRole, navigate, location.pathname, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
