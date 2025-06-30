"use-client";
import AOS from "aos";
import "aos/dist/aos.css";
import { useContext, useEffect, useState } from "react";
import concert_image from "../../assets/images/concert-background 1.png";
import { useNavigate } from "react-router-dom";
import { EventCard } from "../../components/EventCard";

import Business from "../../assets/images/Businsess-program.webp";
import Arts from "../../assets/images/Arts.jpg";
import Sports from "../../assets/images/sports-program.webp";
import Food_expo from "../../assets/images/food.jpeg";
import Music from "../../assets/images/concert-background 1.png";
import Workshop from "../../assets/images/workshops.jpg";
import Review from "../user/Review";
import { MyContext } from "../../context/EventContext";
import Loading from "../Loading";

function Home() {
  const navigate = useNavigate();
  const { SelectedByCategory, eventsArray } = useContext(MyContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });

    // Add animation for hero text
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  const categories = [
    { name: "Music", image: Music, color: "from-purple-500 to-blue-500" },
    { name: "Sports", image: Sports, color: "from-green-500 to-emerald-600" },
    {
      name: "Food Expo",
      image: Food_expo,
      color: "from-orange-400 to-red-500",
    },
    { name: "Arts", image: Arts, color: "from-pink-500 to-rose-500" },
    { name: "Business", image: Business, color: "from-blue-500 to-indigo-600" },
    { name: "Workshop", image: Workshop, color: "from-teal-400 to-cyan-500" },
  ];

  if (!eventsArray) {
    return <Loading />;
  }

  const featuredEvents = eventsArray
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#111] to-[#313030]">
      {/* Hero Section with Background Image and Animated Gradient Overlay */}
      <div
        style={{
          backgroundImage: `url(${concert_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full h-[100vh] flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Dynamic overlay for better text readability with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-sm"></div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/3 animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/5 animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-white rounded-full bottom-1/4 right-1/3 animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>
          <div
            className="absolute w-1 h-1 bg-white rounded-full top-1/3 right-1/4 animate-pulse"
            style={{ animationDuration: "2s" }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-white rounded-full bottom-1/3 left-1/4 animate-pulse"
            style={{ animationDuration: "3.5s" }}
          ></div>
        </div>

        {/* Hero Content with Animated Text */}
        <div className="relative z-10 text-white px-4 sm:px-6 lg:px-8 flex flex-col gap-2 sm:gap-4 text-center lg:text-left lg:pl-[10%] xl:pl-[15%] w-full">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h1 className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-sans bg-gradient-to-r from-white via-white to-gray-300 text-transparent bg-clip-text drop-shadow-lg">
              EXPLORE EVENTS.
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <h1 className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-sans bg-gradient-to-r from-white via-purple-200 to-blue-200 text-transparent bg-clip-text drop-shadow-lg">
              BOOK INSTANTLY.
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <h1 className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-sans bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-transparent bg-clip-text drop-shadow-lg">
              EXPERIENCE THE HYPE.
            </h1>
          </div>

          <div
            className={`w-full max-w-[100%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%] mt-6 sm:mt-8 mx-auto lg:mx-0 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <p className="Montserrat-text text-white/90 font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-relaxed md:leading-loose text-center lg:text-left font-sans">
              Discover concerts, workshops, conferences, and more. Book tickets
              in seconds and create memories that last a lifetime.
            </p>
          </div>

          <div
            className={`w-full mt-8 flex justify-center lg:justify-start transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1500ms" }}
          >
            <button
              onClick={() => navigate("user/events")}
              className="poppins-text bg-gradient-to-r from-[#1f1f1f] to-[#2c2c2e] hover:from-[#2a2a2a] hover:to-[#3a3a3c] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:shadow-[#6B7280]/40 transform hover:scale-105 active:scale-95 border border-[#333]"
              aria-label="Find events"
            >
              Find Events
            </button>
          </div>
        </div>
      </div>

      <div className="w-full py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#161414] to-[#1d1c1c]">
        {/* << ================== Featured Events Section =======================>>  */}
        <div className="max-w-7xl mx-auto">
          {/* Header with "featured events" and "view all" */}
          <div
            className="flex justify-between items-center mb-10"
            data-aos="fade-up"
          >
            <div className="flex items-center">
              <div className="w-1 h-8  rounded-full mr-3"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl Prompt-text font-bold text-white">
                Featured Events
              </h2>
            </div>
            <button
              onClick={() => navigate("user/events")}
              className="flex items-center transition-colors duration-300 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 px-4 py-2 rounded-lg text-white"
            >
              <span className="mr-1 text-sm font-medium">View All</span>
              <i className="bx bx-right-arrow-alt text-lg"></i>
            </button>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <EventCard event={event} aos="none" anchor="top-bottom" />
              </div>
            ))}
          </div>
        </div>

        {/* << ================== Choose Your Vibe Section =======================>>  */}
        <div className="w-full py-16 md:py-20 lg:py-24 sm:px-1 lg:px-2">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10" data-aos="fade-up">
              <div className="flex items-center">
                <div className="w-1 h-8  rounded-full mr-3"></div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl Prompt-text font-bold text-white">
                  Choose Your Vibe
                </h2>
              </div>
              <p className="text-gray-400 mt-3 ml-4 max-w-2xl">
                Explore events by category and find exactly what you're looking
                for
              </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center py-4">
              {categories.map((category, index) => (
                <div
                  className="w-[45%] sm:w-[30%] md:w-[18%] h-64 rounded-xl flex justify-center items-center flex-col cursor-pointer transition-all duration-500 group relative overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  key={index}
                  onClick={() => {
                    SelectedByCategory(category.name);
                    navigate("/events");
                  }}
                >
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Category icon */}
                  <div className="relative z-20 mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:translate-y-2">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg p-0.5`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-900/80">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="object-cover h-full w-full opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category name */}
                  <h1 className="relative z-20 text-white text-lg font-bold mt-2 transition-all duration-300 group-hover:text-white group-hover:scale-110">
                    {category.name}
                  </h1>

                  {/* Hover effect button */}
                  <div className="relative z-20 mt-3 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-xs text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      Explore Now
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section with enhanced styling */}
      <div className="bg-gradient-to-b from-[#1d1c1c] to-[#161414]">
        <Review />
      </div>
    </div>
  );
}

export default Home;
