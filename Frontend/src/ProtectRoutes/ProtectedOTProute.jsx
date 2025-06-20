// ProtectedOtpRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedOtpRoute = ({ children }) => {
  const canVerify = localStorage.getItem("canVerifyOtp");

  if (canVerify === "true") {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedOtpRoute;
