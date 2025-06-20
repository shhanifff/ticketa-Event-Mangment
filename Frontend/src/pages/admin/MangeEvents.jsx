import React, { useContext, useState } from "react";
import AdminSidebar from "../../components/Sidebar";
import { MyContext } from "../../context/EventContext";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../Loading";

function ManageEvents() {
  const { eventsArray } = useContext(MyContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Loading state
  if (!eventsArray) {
    return <LoadingPage />;
  }

  const categories = [
    "All",
    ...Array.from(new Set(eventsArray.map((event) => event.category))),
  ];

  // Enhanced search filter including event ID
  const filteredEvents = eventsArray.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function formatDateTime(eventDate) {
    const date = new Date(eventDate);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return date.toLocaleString("en-US", options);
  }

  return (
    <div className="flex min-h-screen bg-[#161414] font-sans">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 text-white mt-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Manage Events
          </h1>
          <button
            className="mt-4 sm:mt-0 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md"
            onClick={() => navigate("/admin/addEvents")}
          >
            <i className="bx bx-plus text-lg"></i>
            Add Event
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title, category, or event ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-lg">
                No events found. Try adjusting your search or{" "}
                <button
                  className="text-green-400 hover:text-green-500 underline"
                  onClick={() => navigate("/admin/addEvents")}
                >
                  add a new event
                </button>
                .
              </p>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <div
                key={event._id}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-[#2b2b2b] transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={event.banner}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black py-1 px-3 rounded-lg text-sm flex items-center gap-1 transition-all duration-200 group"
                    onClick={() => navigate(`/admin/MangeEvents/${event._id}`)}
                    title="Edit Event"
                  >
                    <i className="bx bx-edit text-base"></i>
                    Edit
                    <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 right-0">
                      Edit Event
                    </span>
                  </button>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-white line-clamp-1">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {event.category} | {formatDateTime(event.date)} |{" "}
                    {event.time}
                  </p>
                  <p className="text-white text-sm mt-2 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="bg-[#292929] text-white px-3 py-1 rounded-full text-sm">
                      {event.ticketType}
                    </span>
                    <span className="text-white text-sm font-medium">
                      {event.price === 0 ? "" : `$${event.price}`}
                    </span>
                  </div>
                  <div className="mt-4 text-gray-400 text-sm">
                    <p>Location: {event.location}</p>
                    <p>Seats Available: {event.seatCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {event._id}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageEvents;
