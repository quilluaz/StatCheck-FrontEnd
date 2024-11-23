import jwtDecode from "jsonwebtoken";

export const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export const isAuthenticated = () => {
  try {
    const user = localStorage.getItem("user");
    const token = getToken();
    return !!user && !!token;
  } catch (error) {
    return false;
  }
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user") || "null");
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const clearAuthData = () => {
  localStorage.removeItem("user");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!requiredRole) return true;
  return userRole === requiredRole;
};
