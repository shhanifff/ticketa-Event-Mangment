import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/public/Login";
import EventDetails from "./pages/public/EventDetails";
import HowItWorks from "./pages/public/HowItWork";
import About from "./pages/public/About";
import EventListing from "./pages/public/EventListing";
import UserProfile from "./pages/user/UserProfile";
import MangeReviews from "./pages/admin/MangeReviews";
import EventDetsils from "./pages/admin/Details/EventDetsils";
import ManageEvents from "./pages/admin/MangeEvents";
import UserDetails from "./pages/admin/Details/UserDetails";
import MangeUsers from "./pages/admin/MangeUsers";
import MangeBooking from "./pages/admin/MangeBooking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound_404 from "./pages/NotFound_404";
import Register from "./pages/public/Register";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/Home";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import EventsAdd from "./pages/admin/EventsAdd";
import EventBooking from "./pages/user/EventBooking";
import OTPVerification from "./pages/user/VerifyOTP";
import BookingQRdetails from "./pages/user/BookingQRdetails";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./ProtectRoutes/ProtectedRoute";
import UserProtectedRoute from "./ProtectRoutes/UserProtectedRoute";
import NotificationClient from "./components/noficationAlert";
import PublicRoute from "./ProtectRoutes/PublicRoute";
import ProtectedOtpRoute from "./ProtectRoutes/ProtectedOTProute";

function App() {
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/otp-verify";

  return (
    <>
      <NotificationClient />
      <ScrollToTop />
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="MangeBooking" element={<MangeBooking />} />
          <Route path="MangeUsers" element={<MangeUsers />} />
          <Route path="MangeUsers/:id" element={<UserDetails />} />
          <Route path="MangeEvents" element={<ManageEvents />} />
          <Route path="MangeEvents/:id" element={<EventDetsils />} />
          <Route path="addEvents" element={<EventsAdd />} />
          <Route path="MangeReviews" element={<MangeReviews />} />
        </Route>

        <Route path="/user" element={<UserProtectedRoute />}>
          <Route path="profile" element={<UserProfile />} />

          <Route path="event-booking/:id" element={<EventBooking />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/otp-verify"
            element={
              <ProtectedOtpRoute>
                <OTPVerification />
              </ProtectedOtpRoute>
            }
          />
        </Route>

        {/* //  booking details  */}
        <Route path="/booking/:bookingId" element={<BookingQRdetails />} />
        {/* // public //  */}
        <Route path="events" element={<EventListing />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        {/* 404 */}
        <Route path="*" element={<NotFound_404 />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
