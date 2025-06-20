import { Navigate, Outlet } from "react-router-dom";

import React from "react";

function ProtectedRoute() {
  const role = localStorage.getItem("admin");
  return role === "admin" ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
