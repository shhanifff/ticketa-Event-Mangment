import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../context/EventContext";
import { EventCard } from "../../components/EventCard";

function EventDetails() {
  const { id } = useParams();
  const { eventsArray } = useContext(MyContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const currentEvent = eventsArray.find((x) => x._id.toString() === id);
  const related = eventsArray.filter(
    (x) => x?.category === currentEvent.category && x._id !== currentEvent._id
  );

  const relatedSortByDate = related.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const sixEvent = relatedSortByDate.slice(0, 6);

  const handleBooking = async () => {
    if (!userId) {
      alert("PLease Login");
    }

    navigate(`/user/event-booking/${id}`);

    console.log(currentEvent?.ticketType);
    console.log(currentEvent?._id, currentEvent?.price);
  };

  function normalDate(dateString) {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleString("en-IN", options);
  }

  return (
    <div className="bg-[#161414] min-h-screen pb-20">
      <div className="w-full max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2">
              <div className="relative h-[300px] sm:h-[400px] lg:h-full w-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#222]">
                    <span className="loader"></span> {/* spinner goes here */}
                  </div>
                )}
                <img
                  src={currentEvent?.banner || "/placeholder.svg"}
                  alt={currentEvent?.title}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-l"></div>
                <div className="absolute top-4 right-4 lg:hidden">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#333] text-white">
                    {currentEvent?.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details - Right side on desktop, bottom on mobile */}
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 text-white">
              {/* Category badge - visible on desktop only */}
              <div className="hidden lg:block mb-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium bg-[#333] text-white`}
                >
                  {currentEvent?.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {currentEvent?.title}
              </h1>

              {/* Ticket type */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    currentEvent?.ticketType === "Free"
                      ? "bg-[#27311C] text-[#83FE7C] "
                      : "bg-blue-600 text-white "
                  }`}
                >
                  {currentEvent?.ticketType.toUpperCase()}
                </span>

                {currentEvent?.availableSeats > 0 ? (
                  <button
                    className="px-6 py-1.5 bg-[#FF6B6B] hover:bg-[#E65555] text-[#EAEAEA] transition-colors rounded-full text-sm font-medium"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    className="px-6 py-2 bg-gray-400 text-white rounded-full text-sm font-semibold cursor-not-allowed opacity-60 shadow-sm"
                    disabled
                  >
                    Sold Out
                  </button>
                )}
              </div>

              {/* Event details section */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <i className="bx bx-calendar text-gray-400 text-xl"></i>
                  <span>{normalDate(currentEvent?.date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bx bx-time text-gray-400 text-xl"></i>
                  <span>{currentEvent?.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bx bx-map-pin text-gray-400 text-xl"></i>
                  <span>{currentEvent?.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bx bx-group text-gray-400 text-xl"></i>
                  <span>Seats Available: {currentEvent?.availableSeats}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                <p className="text-gray-300 leading-relaxed">
                  {currentEvent?.description}
                </p>
              </div>

              {currentEvent?.ticketType === "Paid" ? (
                <div className="w-full sm:w-48 py-3 px-5 bg-gradient-to-r from-[#2A2A2A] to-[#333] rounded-lg shadow-lg flex items-center gap-3">
                  <i className="bx bx-tag text-[#FF6B6B] text-2xl"></i>
                  <div>
                    <div className="text-sm text-gray-400">Price</div>

                    <div className="text-2xl font-bold text-white">
                      {`₹${currentEvent?.price || "0.00"}`}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-white text-2xl font-bold mb-8">Related Events</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sixEvent.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default EventDetails;
