import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasRole } from "../services/TokenAuthAPI";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  
  const authenticated = isAuthenticated();
  
  const hasRequiredRole = authenticated && requiredRole ? hasRole(requiredRole) : true;

  if (!authenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;