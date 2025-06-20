import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

  if (user) {
    return <Navigate to="/" />;
  }
  if (admin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;
