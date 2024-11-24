import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { state: { from: location.pathname }, replace: true });
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      const redirectPath = user?.role === "ADMIN" ? "/admin" : "/home";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, requiredRole, navigate, location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
