

import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../components/Sidebar";
import { addEvents } from "../../api/eventAPI's";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../context/EventContext";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function EventsAdd() {
  const categories = [
    "Sports",
    "Music",
    "Food Expo",
    "Business",
    "Workshop",
    "Arts",
  ];
  const { getAllEventsFromAPI, getNotifications } = useContext(MyContext);
  const navigate = useNavigate();
  const notyf = new Notyf({ duration: 4000, position: { x: "right", y: "top" } });

  // State for form fields
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cate, setCate] = useState("");
  const [seat, setSeat] = useState("");
  const [price, setPrice] = useState("");
  const [ticketType, setTicketType] = useState("Free");
  const [location, setLocation] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTicketType(isPaid ? "Paid" : "Free");
  }, [isPaid]);

  const handleTicketTypeChange = (e) => {
    setIsPaid(e.target.value === "paid");
    if (e.target.value === "free") {
      setPrice("");
      setErrors((prev) => ({ ...prev, price: "" }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Event title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!des.trim()) {
      newErrors.des = "Description is required";
    } else if (des.length > 500) {
      newErrors.des = "Description must be 500 characters or less";
    }

    if (!date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.date = "Please select a future date";
      }
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!time) {
      newErrors.time = "Time is required";
    } else if (!timeRegex.test(time)) {
      newErrors.time = "Enter time in format like 5:00 AM or 12:30 PM";
    }

    if (!cate) {
      newErrors.cate = "Category is required";
    }

    if (!seat) {
      newErrors.seat = "Available seats are required";
    } else if (isNaN(seat) || seat <= 0) {
      newErrors.seat = "Enter a valid number of seats";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!imageFile) {
      newErrors.imageFile = "Event banner is required";
    }

    if (isPaid && !price) {
      newErrors.price = "Price is required for paid events";
    } else if (isPaid && (isNaN(price) || price <= 0)) {
      newErrors.price = "Enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setTitle("");
    setDes("");
    setDate("");
    setTime("");
    setCate("");
    setSeat("");
    setPrice("");
    setTicketType("Free");
    setLocation("");
    setIsPaid(false);
    setImageFile(null);
    setImagePreview("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      notyf.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    const obj = {
      title,
      date,
      des,
      time,
      cate,
      seat,
      price: isPaid ? price : 0,
      ticketType,
      location,
      url: imageFile,
    };

    try {
      await addEvents(obj, getNotifications);
      await getAllEventsFromAPI();
      await getNotifications();
      reset();
      navigate(-1);
    } catch (error) {
      console.log(error)
      notyf.error("Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "Please upload a valid image file",
        }));
        return;
      }
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const formdata = new FormData();
      formdata.append("eventImage", file);
      setImageFile(formdata);
      setErrors((prev) => ({ ...prev, imageFile: "" }));
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setErrors((prev) => ({ ...prev, time: "" }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              Create New Event
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl font-semibold mb-5 text-center text-gray-100">
                  Event Preview
                </h2>

                <div className="aspect-[3/4] bg-gray-900 rounded-xl mb-5 overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Event banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                      <i className="fa-solid fa-image text-5xl mb-3"></i>
                      <p className="text-sm">Banner Preview</p>
                      <p className="text-xs mt-2 px-4 text-center">
                        Upload an image to see the preview
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <h3 className="font-semibold text-lg truncate">
                      {title || "Event Title"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm truncate">{date || "TBD"}</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-sm truncate">{time || "TBD"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="text-sm truncate">{cate || "TBD"}</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-xs text-gray-400">Seats</p>
                      <p className="text-sm truncate">{seat || "TBD"}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-sm truncate">
                      {isPaid ? `₹${price || "0"}` : "Free"}
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm truncate">{location || "TBD"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/50">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                    <i className="fa-solid fa-heading text-indigo-400"></i>
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="e.g. All Kerala Sports Meet"
                    className={`w-full p-3 bg-gray-900/50 border ${
                      errors.title ? "border-red-500" : "border-gray-600"
                    } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                    <i className="fa-solid fa-align-left text-indigo-400"></i>
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={des}
                    onChange={(e) => {
                      setDes(e.target.value);
                      setErrors((prev) => ({ ...prev, des: "" }));
                    }}
                    placeholder="Describe your event"
                    className={`w-full p-3 bg-gray-900/50 border ${
                      errors.des ? "border-red-500" : "border-gray-600"
                    } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                  ></textarea>
                  {errors.des && (
                    <p className="text-red-500 text-xs mt-1">{errors.des}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-calendar text-indigo-400"></i>
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={handleDateChange}
                      className={`w-full p-3 bg-gray-900/50 border ${
                        errors.date ? "border-red-500" : "border-gray-600"
                      } rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-clock text-indigo-400"></i>
                      Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={handleTimeChange}
                      placeholder="e.g. 5:00 AM"
                      className={`w-full p-3 bg-gray-900/50 border ${
                        errors.time ? "border-red-500" : "border-gray-600"
                      } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Category & Seats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-list text-indigo-400"></i>
                      Category
                    </label>
                    <select
                      value={cate}
                      onChange={(e) => {
                        setCate(e.target.value);
                        setErrors((prev) => ({ ...prev, cate: "" }));
                      }}
                      className={`w-full p-3 bg-gray-900/50 border ${
                        errors.cate ? "border-red-500" : "border-gray-600"
                      } rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.cate && (
                      <p className="text-red-500 text-xs mt-1">{errors.cate}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-chair text-indigo-400"></i>
                      Available Seats
                    </label>
                    <input
                      type="number"
                      value={seat}
                      onChange={(e) => {
                        setSeat(e.target.value);
                        setErrors((prev) => ({ ...prev, seat: "" }));
                      }}
                      placeholder="e.g. 2000"
                      className={`w-full p-3 bg-gray-900/50 border ${
                        errors.seat ? "border-red-500" : "border-gray-600"
                      } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    />
                    {errors.seat && (
                      <p className="text-red-500 text-xs mt-1">{errors.seat}</p>
                    )}
                  </div>
                </div>

                {/* Ticket Type & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-ticket text-indigo-400"></i>
                      Ticket Type
                    </label>
                    <div className="flex gap-6 p-3 bg-gray-900/50 border border-gray-600 rounded-xl">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="free"
                          value="free"
                          checked={!isPaid}
                          onChange={handleTicketTypeChange}
                          className="text-indigo-500 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="free"
                          className="text-gray-200 cursor-pointer text-sm"
                        >
                          Free
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="paid"
                          value="paid"
                          checked={isPaid}
                          onChange={handleTicketTypeChange}
                          className="text-indigo-500 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="paid"
                          className="text-gray-200 cursor-pointer text-sm"
                        >
                          Paid
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                      <i className="fa-solid fa-indian-rupee-sign text-indigo-400"></i>
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setErrors((prev) => ({ ...prev, price: "" }));
                      }}
                      placeholder="e.g. 500"
                      disabled={!isPaid}
                      className={`w-full p-3 bg-gray-900/50 border ${
                        errors.price ? "border-red-500" : "border-gray-600"
                      } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                        isPaid ? "" : "opacity-50 cursor-not-allowed"
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-200">
                    <i className="fa-solid fa-location-dot text-indigo-400"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setErrors((prev) => ({ ...prev, location: "" }));
                    }}
                    placeholder="e.g. Kozhikode Beach"
                    className={`w-full p-3 bg-gray-900/50 border ${
                      errors.location ? "border-red-500" : "border-gray-600"
                    } rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-200">
                    <i className="fa-solid fa-image text-indigo-400"></i>
                    Event Banner
                  </label>
                  <div className="flex flex-col">
                    <div className={`relative border-2 border-dashed ${
                      errors.imageFile ? "border-red-500" : "border-gray-600"
                    } rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-all group`}>
                      <input
                        type="file"
                        onChange={handleEventImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl mb-3 text-gray-400 group-hover:text-indigo-400 transition-all"></i>
                        <p className="text-gray-300 text-sm">
                          Click or drag image to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Recommended: 1200×800px, JPG or PNG
                        </p>
                      </div>
                    </div>
                    {errors.imageFile && (
                      <p className="text-red-500 text-xs mt-2">{errors.imageFile}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-8">
                  <button
                    type="button"
                    onClick={reset}
                    className="px-6 py-3 rounded-xl border border-gray-600 text-gray-200 hover:bg-gray-700 transition-all text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-600 text-white font-medium hover:from-indigo-600 hover:to-pink-700 transition-all text-sm flex items-center gap-2 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsAdd;