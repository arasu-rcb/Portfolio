import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Redirect unauthenticated users to the admin login page
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
