import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../context/EventContext";
import axios from "axios";
// import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useContext(MyContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userId = localStorage.getItem("userId");

  // Count unread notifications consistently
  const unreadCount = notifications.filter((notification) => {
    return (
      notification.usersRead &&
      notification.usersRead.some(
        (user) => user.userId === userId && user.isRead === false
      )
    );
  }).length;

  const [notificationCount, setNotificationCount] = useState(unreadCount);

  // Update notification count when notifications change
  useEffect(() => {
    setNotificationCount(unreadCount);
  }, [notifications, unreadCount]);

  const token = localStorage.getItem("token");

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notificationCount > 0) {
      console.log("mark as read", userId);
      let a = await axios.patch(
        `http://localhost:5000/api/markAsRead/${userId}`
      );
      console.log("res for notifiy", a.data.data);
      setNotificationCount(0)
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  // Check if a notification is read by the current user
  const isNotificationRead = (notification) => {
    if (!notification.usersRead) return false;
    const userReadStatus = notification.usersRead.find(
      (user) => user.userId === userId
    );
    return userReadStatus && userReadStatus.isRead;
  };

  function formatDateOnly(createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", 
      year: "numeric",
    });
  }

  return (
    <nav className="w-full bg-[#1A1A1A] text-white sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            ticketa
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            to="/"
            className={`relative px-3 py-2 font-medium text-sm uppercase tracking-wide transition-colors duration-300 
              ${
                isActive("/")
                  ? "text-black dark:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black dark:after:bg-white"
                  : "text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
              } `}
          >
            {isActive("/") ? (
              <>
                <i className="bx bx-home-alt-2"></i> Home
              </>
            ) : (
              "Home"
            )}
          </Link>
          <Link
            to="/user/events"
            className={`relative px-3 py-2 font-medium text-sm uppercase tracking-wide transition-colors duration-300
              ${
                isActive("/user/events")
                  ? "text-black dark:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black dark:after:bg-white"
                  : "text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
              }`}
          >
            {isActive("/user/events") ? (
              <>
                <i className="bx bx-calendar-event"></i> Events
              </>
            ) : (
              "Events"
            )}
          </Link>

          {token ? (
            <>
              {/* Notification Bell Icon */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationClick}
                  className="px-3 py-2 cursor-pointer hover:text-gray-200 text-gray-400 focus:outline-none transition-all duration-300"
                  aria-expanded={showNotifications}
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <i className="fa-solid fa-bell text-lg"></i>
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96  bg-[#1F1F1F] rounded-md shadow-lg border border-gray-800 z-10">
                    <div className="py-2 bg-[#2D2D2D] px-4 border-b border-gray-800 flex justify-between items-center">
                      <p className="text-sm font-medium text-white">
                        Notifications
                      </p>
                      <button
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                        onClick={() => setShowNotifications(false)}
                      >
                        close
                      </button>
                    </div>

                    {notifications && notifications.length > 0 ? (
                      <div className="flex flex-col h-full max-h-[calc(100vh-200px)] overflow-auto bg-[#1f1f1f] rounded-xl shadow-md">
                        {notifications.map((notification) => (
                          <div
                            key={notification.event_id}
                            className="p-4 border-b border-gray-700 hover:bg-[#2D2D2D] transition-colors duration-200 cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <h4
                                className={`text-sm ${
                                  isNotificationRead(notification)
                                    ? "text-white"
                                    : "text-white font-bold"
                                }`}
                              >
                                {notification.event_title}
                              </h4>
                              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                {formatDateOnly(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {notification.event_description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <i className="fa-solid fa-bell-slash text-2xl mb-2"></i>
                        <p className="text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="px-3 py-2 cursor-pointer hover:text-gray-200 text-gray-400 focus:outline-none transition-all duration-300"
                  aria-expanded={showUserMenu}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-[#2D2D2D] rounded-full flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-user text-sm text-gray-200"></i>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1F1F1F] rounded-md shadow-lg border border-gray-800 z-10 overflow-hidden">
                    <div className="py-2 bg-[#2D2D2D] px-4 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">
                        My Account
                      </p>
                    </div>
                    <Link
                      to="/user/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-user-circle text-white/90"></i>
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <i className="fa-solid fa-sign-out-alt text-white/90"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="cursor-pointer font-medium px-5 py-2 text-gray-400 transition-all duration-300 hover:text-gray-200 text-sm tracking-wide flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                LOGIN
              </button>
              <button
                className="cursor-pointer rounded-md bg-gray-400 px-5 py-2 text-black font-semibold text-sm tracking-wide shadow-md hover:drop-shadow-gray-400/50 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                onClick={() => navigate("/register")}
              >
                <i className="fas fa-user-plus"></i> GET STARTED
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Notification Icon for Mobile */}
          {token && (
            <div className="relative mr-2 " ref={notificationRef}>
              <button
                onClick={handleNotificationClick}
                className="p-2 cursor-pointer hover:text-gray-200 text-gray-400 focus:outline-none transition-all duration-300"
                aria-expanded={showNotifications}
                aria-label="Notifications"
              >
                <div className="relative">
                  <i className="fa-solid fa-bell text-lg"></i>
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-[#1F1F1F] rounded-md shadow-lg border border-gray-800 z-50">
                  <div className="py-2 bg-[#2D2D2D] px-4 border-b border-gray-800 flex justify-between items-center">
                    <p className="text-sm font-medium text-white">
                      Notifications
                    </p>
                    <button
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      close
                    </button>
                  </div>

                  {notifications && notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 border-b border-gray-800 hover:bg-[#2D2D2D] transition-colors duration-200 cursor-pointer
                          ${
                            isNotificationRead(notification) ? "opacity-70" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4
                              className={`text-sm ${
                                isNotificationRead(notification)
                                  ? "text-white"
                                  : "text-white font-bold"
                              }`}
                            >
                              {notification.event_title || notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.event_description ||
                              notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <i className="fa-solid fa-bell-slash text-2xl mb-2"></i>
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer rounded-md p-2 text-white hover:bg-[#2D2D2D] focus:outline-none transition-colors duration-300"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <div className="relative h-6 w-6">
                <div className="absolute left-0 top-2.5 h-0.5 w-6 rotate-45 bg-white"></div>
                <div className="absolute left-0 top-2.5 h-0.5 w-6 -rotate-45 bg-white"></div>
              </div>
            ) : (
              <div className="relative h-6 w-6">
                <div className="absolute left-0 top-1 h-0.5 w-6 bg-white"></div>
                <div className="absolute left-0 top-3 h-0.5 w-6 bg-white"></div>
                <div className="absolute left-0 top-5 h-0.5 w-6 bg-white"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* << ==============================================      ========================== >>  */}
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/98 z-50 md:hidden flex flex-col">
          <div ref={mobileMenuRef} className="flex flex-col h-full">
            {/* Header with logo and close button */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-800">
              <Link
                to="/"
                className="text-2xl font-bold tracking-tighter"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-white">ticketa</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="cursor-pointer rounded-md p-2 text-white hover:bg-[#2D2D2D] focus:outline-none"
                aria-label="Close menu"
              >
                <div className="relative h-6 w-6">
                  <div className="absolute left-0 top-2.5 h-0.5 w-6 rotate-45 bg-white"></div>
                  <div className="absolute left-0 top-2.5 h-0.5 w-6 -rotate-45 bg-white"></div>
                </div>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-1 px-4 py-6 flex-grow bg-[#1A1A1A]">
              <Link
                to="/"
                className={`px-4 py-4 rounded-lg flex items-center space-x-3 font-medium ${
                  isActive("/")
                    ? "bg-[#2D2D2D] text-white border-l-4 border-[#9d9d9e]"
                    : "text-gray-400 hover:bg-[#2D2D2D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-home text-white/90"></i>
                <span>Home</span>
              </Link>
              <Link
                to="/user/events"
                className={`px-4 py-4 rounded-lg flex items-center space-x-3 font-medium ${
                  isActive("/user/events")
                    ? "bg-[#2D2D2D] text-white border-l-4 border-[#9d9d9e]"
                    : "text-gray-400 hover:bg-[#2D2D2D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-calendar-alt text-white/90"></i>
                <span>Events</span>
              </Link>

              {token ? (
                <>
                  <Link
                    to="/user/profile"
                    className={`px-4 py-4 rounded-lg flex items-center space-x-3 font-medium ${
                      isActive("/user/profile")
                        ? "bg-[#2D2D2D] border-l-4 border-[#9d9d9e] text-white"
                        : "text-gray-400 hover:bg-[#2D2D2D]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-user-circle text-white/90"></i>
                    <span>Profile</span>
                  </Link>
                  <button
                    className="text-left px-4 py-4 rounded-lg flex items-center space-x-3 font-medium text-gray-400 hover:bg-[#2D2D2D]"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-sign-out-alt text-red-600"></i>
                    <span className="text-red-600">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 mt-6 px-2">
                  <button
                    className="w-full cursor-pointer rounded-lg border border-gray-700 px-6 py-3 text-center text-gray-400 transition-all duration-300 hover:bg-[#2D2D2D] hover:border-gray-600 font-medium"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    className="w-full cursor-pointer rounded-lg bg-[#1A1A1A] px-6 py-3 text-center text-white font-semibold transition-all duration-300 shadow-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    GET STARTED
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-800 text-center text-xs text-gray-500">
              © 2025 ticketa • All rights reserved
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
