import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export function EventCard({ event, aos, anchor }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const navigate = useNavigate();
  const [imgLoading, setImgLoading] = useState(true);

  

  function normalDate(dateString) {
  const date = new Date(dateString);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleString('en-IN', options); 
}

  return (
    <div
      className="flex flex-col justify-between h-full overflow-hidden group bg-[#1B1B1E] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
      data-aos={aos}
      data-aos-anchor-placement={anchor}
      onClick={() => navigate(`/user/events/${event?._id || ""}`)}
    >
      <div className="relative overflow-hidden w-full h-52 sm:h-60 md:h-64 min-h-[13rem]">
        {imgLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-[#2D2D30]">
            <div className="flex flex-col items-center">
              <ClipLoader color="#6B7280" size={35} />
              <span className="mt-2 text-xs text-gray-400">
                Loading image...
              </span>
            </div>
          </div>
        )}
        <img
          src={event?.banner || "https://via.placeholder.com/600x400"}
          alt={event?.title || "Event"}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imgLoading ? "hidden" : "block"
          }`}
        />
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full bg-[#4B5563] text-white">
          {event?.category || "N/A"}
        </span>
      </div>

      {/* Event details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white transition-colors duration-300 truncate">
          {event?.title || "Untitled Event"}
        </h3>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center text-gray-400">
            <i className="fa-solid fa-clock mr-1"></i>
            <span className="truncate">{normalDate(event?.date)}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <i className="fa-solid fa-location-dot mr-1"></i>
            <span className="truncate">{event?.location || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="px-4 py-3 mt-auto flex justify-between items-center border-t border-gray-800 bg-[#2D2D30]">
        <span className="font-bold text-sm text-white">
          {event?.price ? `₹${event.price}` : "FREE"}
        </span>
        <button
          className="px-4 py-1.5 text-sm font-semibold rounded-sm text-white bg-[#4B5563] transition-all duration-300 hover:bg-[#6B7280]"
          aria-label="Book now"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
