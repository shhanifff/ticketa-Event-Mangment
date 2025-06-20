/* eslint-disable no-undef */
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { MyContext } from "../../context/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function EventBooking() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { eventsArray, eventBoking, activeUserDetails } = useContext(MyContext);
  const { id } = useParams();

  const currentEvent = eventsArray.find((x) => x._id.toString() === id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const email = watch("email");
  const phone = watch("phone");
  const quantity = watch("quantity");

  const onSubmit = async (data) => {
    const { email, phone, quantity } = data;

    if (currentEvent?.ticketType === "Paid") {
      try {
        // Load Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = async () => {
          try {
            let res = await axios.get(`http://localhost:5000/api/getKey`);
            const key = res.data.key;
            console.log("key", key);

            const userId = localStorage.getItem("userId");
            let data = await axios.post(
              `http://localhost:5000/api/payment/${userId}`,
              {
                price: currentEvent?.price,
              }
            );

            console.log("booking created", data.data);

            const options = {
              key,
              amount: (currentEvent?.price * 100) * quantity,
              currency: "INR",
              name: "Acme Corp",
              description: "Test Transaction",
              order_id: data.data.id,
              prefill: {
                name: `${activeUserDetails.username}`,
                email: `${activeUserDetails.email}`,
                contact: "9999999999",
              },
              theme: {
                color: "#F37254",
              },
              handler: function (response) {
                const paymentDetails = {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  amount: currentEvent?.price,
                  paymentMethod: "Razorpay",
                };
                // Payment success ayi kazhinju ith call avum
                console.log("payment details", paymentDetails);
                console.log("Payment Successful:", response);
                toast.success("Payment success");
                eventBoking(id, email, phone, quantity, paymentDetails);
              },
            };
            navigate(-1);

            const rzp = new Razorpay(options);
            rzp.open();
          } catch (error) {
            toast.error("Payment Failed");
            console.error("Payment error:", error);
          }
        };
        document.body.appendChild(script);
      } catch (error) {
        toast.error("Error loading Razorpay script");
        console.error("Script error:", error);
      }
    } else {
      eventBoking(id, email, phone, quantity);
    }
  };

  return (
    <div className="bg-[#161414] min-h-screen py-12 sm:py-16 font-sans">
      <div className="w-11/12 sm:w-10/12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white opacity-[70%] tracking-wide leading-tight mb-8 text-center">
          Book Tickets for {currentEvent?.title || "Event"}
        </h1>

        <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl border border-[#2d2d2d]">
          <div className="relative h-[200px] sm:h-[300px] lg:h-[400px]">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-t-gray-200 border-gray-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={
                currentEvent?.banner || "https://via.placeholder.com/800x400"
              }
              alt={currentEvent?.title || "Event"}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 text-white">
            <form
              className="space-y-5 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-[#333] text-white placeholder-italic rounded-md border border-[#2d2d2d] focus:outline-none focus:border-[#FF6B6B]"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 bg-[#333] text-white placeholder-italic rounded-md border border-[#2d2d2d] focus:outline-none focus:border-[#FF6B6B]"
                  {...register("phone", {
                    required: "Phone number is required",
                    maxLength: {
                      value: 10,
                      message: "Phone number should not exceed 10 digits",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number should be at least 10 digits",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Ticket Quantity Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter number of tickets"
                  className="w-full px-4 py-2.5 bg-[#333] text-white placeholder-italic rounded-md border border-[#2d2d2d] focus:outline-none focus:border-[#FF6B6B]"
                  {...register("quantity", {
                    required: "Please enter number of tickets",
                    min: { value: 1, message: "At least 1 ticket required" },
                    validate: (value) =>
                      value <= currentEvent?.availableSeats ||
                      `Only ${currentEvent?.availableSeats} seats available`,
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2.5 bg-gray-400 text-black text-sm font-semibold tracking-wide rounded-md"
              >
                Book Tickets
              </button>

              {!email && !phone && !quantity ? (
                ""
              ) : (
                <p className="text-yellow-400 text-xs sm:text-sm font-medium mt-4 text-center">
                  ⚠️ Please double-check your details. Once booked, ticket
                  information cannot be changed.
                </p>
              )}
            </form>

            {/* Event Details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-base font-light text-gray-300">
              <div className="flex items-center gap-2">
                <i className="bx bx-calendar text-gray-400 text-xl"></i>
                <span>{currentEvent?.date || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bx bx-time text-gray-400 text-xl"></i>
                <span>{currentEvent?.time || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bx bx-map-pin text-gray-400 text-xl"></i>
                <span>{currentEvent?.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventBooking;
