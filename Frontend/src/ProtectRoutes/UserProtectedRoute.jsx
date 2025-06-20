import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const user = localStorage.getItem("user");
  return user === "user" ? <Outlet /> : <Navigate to="/admin/dashboard" />;
};

export default UserProtectedRoute;
