import { Notyf } from "notyf";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
});

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  notyf;
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const clear = () => {
    localStorage.clear();
    notyf.success("Admin successfully logged out");
  };

  const adminName = "John Doe";
  const adminRole = "Admin";
  const profileImage = "/api/placeholder/40/40";

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 right-0 left-0 bg-[#161414] shadow-md z-30 transition-all duration-300 ${
          isOpen ? "pl-64" : "pl-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            {isOpen ? (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-white/80 hover:text-white/100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="p-2 text-sm  text-white/80 hover:text-white/100"
              >
                <i class="bx bx-menu text-2xl"></i>{" "}
              </button>
            )}
            <div className="font-bold text-xl text-white">ticketa</div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:block text-white/70">{adminName}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={profileImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#161414] transition-all duration-300 ease-in-out z-40 shadow-xl ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <span
              className={`text-white font-bold text-xl transition-all duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              ticketa
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-5 border-b border-gray-700 ${
              isOpen ? "justify-start" : "hidden"
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={profileImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`ml-3 transition-all duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <div className="text-white font-medium">{adminName}</div>
              <div className="text-gray-400 text-xs">{adminRole}</div>
            </div>
          </div>

          <div className="flex flex-col flex-grow py-4">
            {[
              {
                icon: "bx-grid-alt",
                text: "Dashboard",
                link: "/admin/dashboard",
              },
              {
                icon: "bx-calendar-event",
                text: "Event Management",
                link: "/admin/MangeEvents",
              },
              {
                icon: "bx-user",
                text: "User Management",
                link: "/admin/MangeUsers",
              },
              {
                icon: "bx-receipt",
                text: "Booking Management",
                link: "/admin/MangeBooking",
              },
              {
                icon: "bx-star",
                text: "Review Management",
                link: "/admin/MangeReviews",
              },
            ].map((item, index) => (
              <NavItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                isOpen={isOpen}
                link={item.link}
                onClick={closeSidebar}
                index={index}
              />
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <NavItem
              icon="bx-log-out"
              text="Logout"
              isOpen={isOpen}
              link="/"
              onClick={(closeSidebar, clear)}
              index={5}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`pt-16 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-4">{/* Page content */}</div>
      </div>
    </>
  );
}

function NavItem({ icon, text, isOpen, link, onClick, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={link}
      className="relative"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center py-3 px-4 text-gray-300 hover:bg-white hover:text-black transition-all duration-200 cursor-pointer ${
          isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10 pointer-events-none"
        }`}
        style={{
          transitionDelay: `${isOpen ? index * 100 : 0}ms`,
        }}
      >
        <i className={`bx ${icon} text-xl`}></i>
        <span
          className={`ml-3 transition-all duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 hidden"
          }`}
        >
          {text}
        </span>
      </div>

      {!isOpen && isHovered && (
        <div className="absolute left-16 top-0 z-50 bg-gray-800 text-white py-2 px-4 rounded shadow-lg whitespace-nowrap opacity-100 transition-all duration-200">
          {text}
        </div>
      )}
    </Link>
  );
}

export default AdminSidebar;