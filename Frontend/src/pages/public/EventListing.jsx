import React, { useContext, useEffect, useState } from "react";
import { EventCard } from "../../components/EventCard";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { MyContext } from "../../context/EventContext.jsx";

const categories = [
  { label: "All Events", value: "all" },
  { label: "Music", value: "Music" },
  { label: "Sports", value: "Sports" },
  { label: "Food Expo", value: "Food Expo" },
  { label: "Arts", value: "Arts" },
  { label: "Workshop", value: "Workshop" },
  { label: "Business", value: "Business" },
];

function EventListing() {
  const { eventsArray, SelectedByCategory } = useContext(MyContext);
  const [filterByCategory, setFilterByCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const eventsPerPage = 9;

  const handleCategorySelect = (value) => {
    const actualValue = value === "all" ? "" : value;
    setFilterByCategory(actualValue);
    SelectedByCategory(actualValue || "all");
    setIsDropdownOpen(false);
  };

  // Filter and search logic
  const filteredEvents = eventsArray.filter((event) => {
    const matchesCategory = filterByCategory
      ? event.category === filterByCategory
      : true;
    const matchesSearch =
      (event.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.location?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (event.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterByCategory]);

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-10 lg:px-28 bg-[#1B1B1E]">
      {/* Search and category */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Search Box */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#2D2D30] w-full h-12 rounded-lg pl-5 pr-10 text-white placeholder:text-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#4B5563] transition-all duration-200"
            placeholder="Search events..."
          />
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-lg absolute top-1/2 right-4 transform -translate-y-1/2"></i>
        </div>

        {/* Custom Dropdown */}
        <div className="relative w-full md:w-1/3">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#2D2D30] w-full h-12 rounded-lg pl-5 pr-4 text-gray-400 text-base flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4B5563]"
          >
            {filterByCategory || "All Events"}
            <span className="text-gray-400">▼</span>
          </div>
          {isDropdownOpen && (
            <ul className="absolute z-10 w-full bg-[#2D2D30] mt-1 rounded-lg shadow-lg overflow-hidden">
              {categories.map((cat) => (
                <li
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className="px-5 py-3 text-gray-400 hover:bg-black hover:text-white cursor-pointer transition-all"
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              aos="fade-up"
              anchor="top-bottom"
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 text-lg mt-10">
            No events found for "{searchQuery}".
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="flex justify-center mt-12 space-x-4 items-center">
          <button
            className={`px-4 py-2 rounded-lg bg-[#2D2D30] text-gray-400 border border-[#4B5563] hover:bg-[#6B7280] transition-all duration-200 flex items-center gap-2 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <GoChevronLeft className="text-lg" />
            Prev
          </button>

          <span className="text-gray-400 text-sm font-bold">
            {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 rounded-lg bg-[#2D2D30] text-gray-400 border border-[#4B5563] hover:bg-[#6B7280] transition-all duration-200 flex items-center gap-2 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
            <GoChevronRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}

export default EventListing;
