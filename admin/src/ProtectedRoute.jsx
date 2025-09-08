import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    // Token expiration check
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }

    // Admin check
    if (adminOnly && !decoded.admin) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
