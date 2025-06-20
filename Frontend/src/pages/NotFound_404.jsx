
import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // For animations

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#161414] items-center justify-center text-white">
      <div className="text-center p-6">
        {/* Animated Boxicon */}
        <motion.i
          className="bx bx-ticket text-8xl mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        ></motion.i>

        {/* 404 Message */}
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Oops! Ticket Not Found</h2>
        <p className="text-lg mb-8 max-w-md mx-auto">
          Looks like this event is sold out or doesn't exist. Let's get you back to the main stage!
        </p>

        {/* Call to Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className=" text-white/25 bg-[#B0B0B0]/20 hover:bg[#B0B0B0]/100 px-6 py-3 rounded-full font-semibold hover:text-white/80 transition"
          >
            Back to Home
          </Link>
          <Link
            to="user/events"
            className="bg-transparent border-2   text-white/25 px-6 py-3 rounded-full font-semibold  hover:text-white/80  hover:border-white/80 transition"
          >
            Explore Events
          </Link>
        </div>

        
      </div>
    </div>
  );
};

export default NotFound;