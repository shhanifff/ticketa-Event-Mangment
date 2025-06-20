/* eslint-disable no-unused-vars */
import blank_profile from '../../assets/images/Profile_avatar.png'
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from "axios";
import { useContext } from "react";
import { MyContext } from "../../context/EventContext";
import LoadingPage from "../Loading";

// Create an instance of Notyf
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

function Review() {
  const { allReviews, reviews } = useContext(MyContext);

  // if (!reviews) {
  //   return <LoadingPage />;
  // }

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const formRef = useRef();

  const [review, setReview] = useState("");

  const userId = localStorage.getItem("userId");
  const handleSubmit = async () => {
    if (review && userRating) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/addreview",
          {
            userId,
            review,
            rating: userRating,
          }
        );
        notyf.success("Thanks for your feedback");
        setReview("");
        setUserRating(0);
        setShowForm(false);
        allReviews();
      } catch (err) {
        console.error("Error submitting review:", err);
        notyf.error("Failed to submit review");
      }
    } else {
      notyf.error("Please provide a review and rating");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  // Animation controls
  const controls = useAnimation();
  const [pauseAnimation, setPauseAnimation] = useState(false);

  // Animate the carousel
  useEffect(() => {
    if (!reviews || reviews.length === 0 || pauseAnimation) {
      controls.stop();
      return;
    }

    const cardWidth = 312;
    const singleSetWidth = cardWidth * reviews.length; 

    const infiniteScroll = async () => {
      try {
        // Reset to initial position
        await controls.start({
          x: 0,
          transition: { duration: 0 },
        });

        // Animate to the end of the first set
        await controls.start({
          x: -singleSetWidth,
          transition: {
            duration: reviews.length * 5, // 5 seconds per card
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    infiniteScroll();

    return () => {
      controls.stop();
    };
  }, [controls, pauseAnimation, reviews]);

  // Duplicate reviews for seamless scrolling
  const extendedReviews = [...(reviews || []), ...(reviews || [])];

  return (
    <div className="py-20 px-6 sm:px-10 lg:px-20 bg-[#1B1B1E] overflow-hidden relative">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#7C3AED] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#6D28D9] blur-3xl"></div>
      </div>

      {/* Content container with relative positioning */}
      <div className="relative z-10">
        {/* Main Heading with decorative elements */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-1 bg-[#7C3AED] rounded-full mb-4"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white">
            What Our Users Say
          </h2>
          <p className="text-gray-400 mt-4 text-center max-w-2xl">
            Join thousands of satisfied users who have found their perfect
            events through our platform
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="w-full overflow-hidden"
          onMouseEnter={() => setPauseAnimation(true)}
          onMouseLeave={() => setPauseAnimation(false)}
        >
          <motion.div
            className="flex gap-6"
            animate={controls}
            style={{
              width: "fit-content",
            }}
          >
            {extendedReviews.map((item, index) => (
              <motion.div
                key={`${item._id}-${index}`}
                className="w-72 flex-shrink-0 bg-[#1e1e1e] rounded-xl flex flex-col p-6 h-auto shadow-lg border border-gray-800 transition-all duration-300"
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                      : "none",
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* User info with simple circular avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2D2D30]">
                    <img
                      src={
                        item?.userId?.profileImage || blank_profile
                      }
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="text-white text-base font-medium">
                      @{item?.userId?.username}
                    </span>
                    <div className="mt-1">
                      <span className="text-[#FBBF24] text-sm flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`${
                                i < item.rating
                                  ? "text-[#FBBF24]"
                                  : "text-gray-500"
                              } text-lg`}
                            >
                              ★
                            </span>
                          ))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote icon */}
                <div className="text-gray-500 text-4xl font-serif mb-2"></div>

                {/* Review text */}
                <p className="text-gray-300 text-base flex-grow mb-4">
                  {item?.review}
                </p>

                {/* Simple line instead of colored element */}
                <div className="h-px w-16 bg-gray-700 self-end mt-2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to action */}
        {userId ? (
          <div className="mt-16 text-center">
            <button
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
              onClick={() => setShowForm(true)}
            >
              Share Your Experience
            </button>
          </div>
        ) : (
          ""
        )}

        {/* Review form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#1B1B1E]/80 z-50">
            <div
              ref={formRef}
              className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl w-[90%] max-w-md border border-gray-800"
            >
              <h3 className="text-white text-xl mb-4">Share Your Review</h3>

              {/* Textarea for review */}
              <textarea
                placeholder="Write your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full h-24 p-2 rounded bg-[#2D2D30] text-white mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all duration-200"
              ></textarea>

              {/* Star rating selection */}
              <div className="mb-4">
                <span className="text-gray-300 block mb-1">Your Rating:</span>
                <div className="flex space-x-1 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`${
                        userRating >= star ? "text-[#FBBF24]" : "text-gray-500"
                      } transition-colors duration-200`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-[#EF4444] text-white px-6 py-3 rounded-md hover:bg-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#EF4444] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#7C3AED] text-white px-6 py-3 rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
