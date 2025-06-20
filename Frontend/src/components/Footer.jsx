

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple animation on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-[#1B1B1E] to-[#161618] text-white relative overflow-hidden">
      {/* Decorative elements with improved responsiveness */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4B5563] to-transparent opacity-30"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4B5563] rounded-full filter blur-[100px] opacity-10"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#6B7280] rounded-full filter blur-[100px] opacity-10"></div>
      
      {/* Added subtle grain texture */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }}></div>

      {/* Logo & Social Media Section - Improved for mobile */}
      <div 
        className={`relative py-12 sm:py-16 px-6 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Logo Section with enhanced animations */}
        <div className="flex items-center gap-4 mb-8 sm:mb-0 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#4B5563] to-[#6B7280] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-[#4B5563]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4B5563] to-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <span className="text-white text-xl sm:text-2xl font-bold relative z-10">
              T
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text group-hover:text-transparent transition-all duration-500">
              ticketa
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Experience the hype</span>
            </div>
          </div>
        </div>

        {/* Social Media Icons - Improved layout for mobile */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6 relative group"
            aria-label="Instagram"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 filter blur-md transition-opacity duration-300"></div>
            <i className="fa-brands fa-instagram text-2xl sm:text-3xl relative z-10"></i>
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6 relative group"
            aria-label="Facebook"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-0 group-hover:opacity-20 filter blur-md transition-opacity duration-300"></div>
            <i className="fa-brands fa-facebook text-2xl sm:text-3xl relative z-10"></i>
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6 relative group"
            aria-label="YouTube"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full opacity-0 group-hover:opacity-20 filter blur-md transition-opacity duration-300"></div>
            <i className="fa-brands fa-youtube text-2xl sm:text-3xl relative z-10"></i>
          </a>
        </div>
      </div>

      {/* Footer Navigation - Improved grid for mobile */}
      <div className="relative bg-gradient-to-b from-[#232326] to-[#2D2D30] px-6 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 lg:gap-12">
            {/* Who We Are */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h2 className="text-lg font-bold mb-1 sm:mb-2 relative">
                <span className="relative z-10">Who We Are</span>
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4B5563] to-transparent"></span>
              </h2>
              <Link
                to="/about"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>About Us</span>
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>How It Works</span>
              </Link>
              <Link
                to="/support"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Support</span>
              </Link>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h2 className="text-lg font-bold mb-1 sm:mb-2 relative">
                <span className="relative z-10">Explore</span>
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4B5563] to-transparent"></span>
              </h2>
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Home</span>
              </Link>
              <Link
                to="/user/events"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Events</span>
              </Link>
              <Link
                to="/user/profile"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Profile</span>
              </Link>
            </div>

            {/* Resource */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h2 className="text-lg font-bold mb-1 sm:mb-2 relative">
                <span className="relative z-10">Resource</span>
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4B5563] to-transparent"></span>
              </h2>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Privacy Policy</span>
              </Link>
              <Link
                to="/faqs"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>FAQs</span>
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="w-0 h-0.5 bg-[#4B5563] group-hover:w-3 transition-all duration-300"></span>
                <span>Terms & Conditions</span>
              </Link>
            </div>

            {/* Contact - Responsive improvements */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h2 className="text-lg font-bold mb-1 sm:mb-2 relative">
                <span className="relative z-10">Contact</span>
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4B5563] to-transparent"></span>
              </h2>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-full bg-[#2D2D30] flex items-center justify-center group-hover:bg-[#4B5563] transition-colors duration-300">
                  <i className="fa-solid fa-location-dot text-sm"></i>
                </div>
                <span className="text-sm sm:text-base">Ticketa Complex, Bangalore</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-full bg-[#2D2D30] flex items-center justify-center group-hover:bg-[#4B5563] transition-colors duration-300">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </div>
                <span className="text-sm sm:text-base">support@ticketa.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-full bg-[#2D2D30] flex items-center justify-center group-hover:bg-[#4B5563] transition-colors duration-300">
                  <i className="fa-solid fa-phone text-sm"></i>
                </div>
                <span className="text-sm sm:text-base">+91 999 888 9999</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription - New section */}
      {/* <div className="relative bg-[#1F1F23] w-full py-10 sm:py-12 px-6 sm:px-8 lg:px-16 border-t border-[#2D2D30]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive offers and event updates</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#2D2D32] border border-[#3D3D42] rounded-md px-4 py-2 outline-none focus:border-[#4B5563] transition-colors duration-200 w-full sm:w-64"
            />
            <button className="bg-gradient-to-r from-[#4B5563] to-[#6B7280] hover:from-[#6B7280] hover:to-[#9CA3AF] text-white font-medium py-2 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-[#4B5563]/30">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}

      {/* Copyright Bar - Improved for mobile */}
      <div className="relative bg-[#1B1B1E] w-full py-6 px-6 sm:px-8 lg:px-16 border-t border-[#2D2D30]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 sm:mb-0 text-center sm:text-left">
            © 2025 Ticketa. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top button - New addition */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 bg-[#4B5563] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B7280] transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <i className="fa-solid fa-arrow-up text-sm"></i>
      </button>
    </div>
  );
}

export default Footer;