import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MyContext } from "../../../context/EventContext";
import { deleteEvent, editEvent } from "../../../api/eventAPI's";

function EventDetails() {
  const { eventsArray, getAllEventsFromAPI } = useContext(MyContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const currentEvent = eventsArray.find((event) => event._id === id);
  const ticketType = watch("ticketType");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (currentEvent) {
      const eventDate = new Date(currentEvent.date);
      const formattedDate = eventDate.toISOString().split("T")[0];

      setValue("title", currentEvent.title || "");
      setValue("category", currentEvent.category || "");
      setValue("description", currentEvent.description || "");
      setValue("date", formattedDate || "");
      setValue("time", currentEvent.time || "");
      setValue("location", currentEvent.location || "");
      setValue("ticketType", currentEvent.ticketType || "");
      setValue("price", currentEvent.price || "");
      setValue("availableSeats", currentEvent.availableSeats || "");
      setImagePreview(currentEvent.banner || "");
    }
  }, [currentEvent, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setImageFile(file);
    }
  };

  const onSubmit = async (data) => {
    if (data.ticketType !== "Paid") {
      data.price = "";
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("location", data.location);
    formData.append("ticketType", data.ticketType);
    formData.append("price", data.price);
    formData.append("availableSeats", data.availableSeats);

    formData.append("eventImage", imageFile);

    await editEvent(formData, id, navigate);
    await getAllEventsFromAPI();
  };

  const handleDelete = async () => {
    await deleteEvent(id, navigate);
    await getAllEventsFromAPI();
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (!currentEvent) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-xl text-gray-300">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-300 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
          <i className="bx bxs-edit mr-3 text-gray-400"></i> Edit Event
        </h1>

        {/* Preview Banner */}
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden relative bg-gray-800">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Event banner preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <i className="bx bx-image-alt text-5xl"></i>
            </div>
          )}
          <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="bg-gray-800 text-white px-4 py-2 rounded-md">
              <i className="bx bx-camera mr-2"></i> Update Banner
            </span>
          </label>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("title", { required: true })}
            />
            {errors.title && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("category", { required: true })}
            >
              <option value="">Select</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts</option>
              <option value="Business">Business</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Date</label>
            <input
              type="date"
              min={minDate}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("date", { required: true })}
            />
            {errors.date && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Time */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Time</label>
            <input
              type="text"
              placeholder="e.g. 5:00 PM"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("time", {
                required: true,
                pattern: {
                  value: /^(1[0-2]|0?[1-9]):[0-5][0-9] ?(AM|PM)$/i,
                  message: "Invalid time format (e.g. 5:00 PM)",
                },
              })}
            />
            {errors.time && (
              <p className="text-red-500 text-sm">
                {errors.time.message || "Required"}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("location", { required: true })}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Ticket Type */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Ticket Type
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("ticketType", { required: true })}
            >
              <option value="">Select</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
            {errors.ticketType && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Price */}
          {ticketType === "Paid" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Price</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
                {...register("price", { required: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">Required</p>}
            </div>
          )}

          {/* Seats */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Available Seats
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none"
              {...register("availableSeats", { required: true })}
            />
            {errors.availableSeats && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Delete Event
            </button>
            <button
              type="button"
              onClick={()=> navigate(-1)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventDetails;
