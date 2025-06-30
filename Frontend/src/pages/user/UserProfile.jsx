import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/EventContext";
import LoadingPage from "../Loading";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import blank_profile from "../../assets/images/Profile_avatar.png";

const notyf = new Notyf({
  position: { x: "right", y: "top" },
});

function UserProfile() {
  const {
    activeUserDetails,
    activeUserBookings,
    changeUserName,
    profileUpload,
  } = useContext(MyContext);
  const [selectedEvents, setSelectedEvents] = useState("featuredEvents");
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", email: "" });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [showChangeText, setShowChangeText] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log("current user details", activeUserDetails);
    console.log("current user bookings", activeUserBookings);
    if (activeUserDetails) {
      setFormValues({
        username: activeUserDetails.username || "",
        email: activeUserDetails.email || "",
      });
    }
  }, [activeUserDetails]);

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  // Add event listener to close modal on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowQrModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!activeUserDetails || !activeUserBookings?.bookings) {
    return <LoadingPage />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormChanged(
      value !== activeUserDetails[name] ||
        formValues.username !== activeUserDetails.username ||
        formValues.email !== activeUserDetails.email
    );
  };

  const handleSave = () => {
    const { email, username } = formValues;
    changeUserName(username, email);
    notyf.success("Profile Updated");
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
    setFormValues({
      username: activeUserDetails.username || "",
      email: activeUserDetails.email || "",
    });
    setIsFormChanged(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("file in profile", file);
    if (file) {
      file.preview = URL.createObjectURL(file);
      setSelectedFile(file);
      const formdata = new FormData();
      formdata.append("profileImage", file);
      profileUpload(formdata, userId);
    }
  };

  const openQrModal = (booking) => {
    setSelectedBooking(booking);
    setShowQrModal(true);
  };

  const closeQrModal = () => {
    setShowQrModal(false);
    setSelectedBooking(null);
  };

  const sortedBookings = [...activeUserBookings.bookings].sort(
    (a, b) => new Date(a?.eventId?.date) - new Date(b?.eventId?.date)
  );

  const today = new Date();
  const todayString = today.toDateString();

  const upcomingEvents = sortedBookings.filter((x) => {
    const eventDate = new Date(x?.eventId?.date);
    return eventDate.toDateString() >= todayString;
  });

  const pastEvents = sortedBookings.filter((x) => {
    const eventDate = new Date(x?.eventId?.date);
    return eventDate.toDateString() < todayString;
  });

  const normalDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#252528] rounded-xl shadow mx-4 sm:mx-0">
      <div className="bg-[#1B1B1E] p-5 rounded-full mb-4">
        <i className="bx bx-calendar-x text-gray-400 text-4xl"></i>
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">
        No Bookings Found
      </h3>
      <p className="text-gray-400 text-center max-w-sm">{message}</p>
      <button
        className="mt-6 px-6 py-2 bg-[#374151] hover:bg-[#4B5563] rounded-xl text-white text-sm font-semibold transition-all duration-300"
        onClick={() => navigate("/events")}
      >
        <i className="bx bx-compass mr-2 text-base"></i>
        Explore Events
      </button>
    </div>
  );

  const BookingCard = ({ booking }) => {
    const event = booking?.eventId;
    return (
      <div className="bg-[#252528] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition mx-4 sm:mx-0">
        <img
          src={event?.banner}
          alt={event?.title}
          className="w-full h-32 sm:h-40 object-cover"
        />
        <div className="p-4 space-y-1">
          <h3 className="text-white text-base sm:text-lg font-semibold">
            {event?.title}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            <i className="bx bx-calendar mr-1"></i> Date:{" "}
            {normalDate(event?.date)}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            <i className="bx bx-time-five mr-1"></i> Time: {event?.time}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            <i className="bx bx-map mr-1"></i> Location: {event?.location}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            <i className="bx bx-receipt mr-1"></i> Tickets: {booking?.quantity}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            <i className="bx bx-calendar-check mr-1"></i> Booking Date:{" "}
            {normalDate(booking?.Created_At)}
          </p>
          <p
            className="cursor-pointer text-right text-blue-400 hover:text-blue-500 text-xs sm:text-sm"
            onClick={() => openQrModal(booking)}
          >
            View QR code ..
          </p>
        </div>
      </div>
    );
  };

  // QR Code Modal Component
  const QrCodeModal = () => {
    if (!showQrModal || !selectedBooking) return null;

    const event = selectedBooking?.eventId;

    console.log("image qr code link", selectedBooking?.qrCodeImage);
    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-[#252528] rounded-xl max-w-md w-full shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                Event QR Code
              </h3>
            </div>

            <div className="flex flex-col items-center mb-6">
              <img
                // src={event?.qrCodeImage}
                src={`${selectedBooking?.qrCodeImage}`}
                alt={`${event?.title}`}
                className="w-48 h-48 bg-white p-2 rounded-lg mb-4"
              />
              <p className="text-center text-gray-400 text-sm mb-2">
                Present this QR code at the event entrance
              </p>
            </div>

            <div className="bg-[#1B1B1E] p-4 rounded-lg mb-4">
              <h4 className="text-white font-medium mb-2">{event?.title}</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">
                  <i className="bx bx-calendar mr-1"></i>{" "}
                  {normalDate(event?.date)}
                </p>
                <p className="text-gray-400">
                  <i className="bx bx-time-five mr-1"></i> {event?.time}
                </p>
                <p className="text-gray-400">
                  <i className="bx bx-map mr-1"></i> {event?.location}
                </p>
                <p className="text-gray-400">
                  <i className="bx bx-receipt mr-1"></i>{" "}
                  {selectedBooking?.quantity} Tickets
                </p>
              </div>
            </div>

            <button
              onClick={closeQrModal}
              className="w-full py-2 bg-[#374151] hover:bg-[#4B5563] rounded-lg text-white text-sm font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#1B1B1E] p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-gradient-to-b from-[#2D2D30] to-[#252528] rounded-xl p-6 sm:p-8 shadow-md">
          <h2 className="text-gray-400 text-sm sm:text-base font-semibold mb-6 uppercase tracking-wider">
            User Profile
          </h2>
          <div className="flex flex-col items-center">
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24"
              onMouseEnter={() => setShowChangeText(true)}
              onMouseLeave={() => setShowChangeText(false)}
            >
              <label htmlFor="fileInput">
                <img
                  src={activeUserDetails?.profileImage || blank_profile}
                  alt={activeUserDetails?.username}
                  className="w-full h-full rounded-full object-cover border-2 border-[#6B7280] transition-opacity hover:opacity-70 cursor-pointer"
                />
                {showChangeText && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      Change
                    </span>
                  </div>
                )}
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                name="profilePicture"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-white text-center mt-4">
              <div className="mb-2">
                <span className="text-lg sm:text-xl font-medium">
                  {activeUserDetails?.username}
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                {activeUserDetails?.email}
              </p>
            </div>
            <button
              className="mt-6 px-6 py-2 bg-[#374151] hover:bg-[#4B5563] rounded-xl text-white text-sm font-semibold transition"
              onClick={() => setEdit(true)}
            >
              <i className="bx bx-edit-alt mr-2"></i>
              Edit Profile
            </button>
          </div>

          {edit && (
            <div className="mt-6 p-4 sm:p-6 bg-[#2F2F32] rounded-lg">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-4">
                Edit Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-1 block">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formValues.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#252528] text-white rounded-lg border border-[#3D3D40] focus:outline-none focus:border-[#6B7280] text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#252528] text-white rounded-lg border border-[#3D3D40] focus:outline-none focus:border-[#6B7280] text-sm"
                  />
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                      isFormChanged
                        ? "bg-[#374151] hover:bg-[#4B5563] text-white"
                        : "bg-[#2F2F32] text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleSave}
                    disabled={!isFormChanged}
                  >
                    Save Changes
                  </button>
                  <button
                    className="flex-1 py-2 bg-[#2F2F32] hover:bg-[#374151] rounded-lg text-white text-xs sm:text-sm font-semibold transition"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h2 className="text-white text-lg font-semibold">My Bookings</h2>
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                selectedEvents === "featuredEvents"
                  ? "bg-[#374151] text-white"
                  : "bg-[#2F2F32] text-gray-400"
              }`}
              onClick={() => setSelectedEvents("featuredEvents")}
            >
              Upcoming Events
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                selectedEvents === "pastEvents"
                  ? "bg-[#374151] text-white"
                  : "bg-[#2F2F32] text-gray-400"
              }`}
              onClick={() => setSelectedEvents("pastEvents")}
            >
              Past Events
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {selectedEvents === "featuredEvents" ? (
              upcomingEvents.length > 0 ? (
                upcomingEvents.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))
              ) : (
                <EmptyState message="No upcoming events booked yet." />
              )
            ) : pastEvents.length > 0 ? (
              pastEvents.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))
            ) : (
              <EmptyState message="You haven't attended any events yet." />
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal />
    </div>
  );
}

export default UserProfile;
