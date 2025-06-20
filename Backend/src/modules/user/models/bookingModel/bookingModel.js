import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bookings: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
        required: true,
      },
      bookingId: {
        type: String,
        required: true,
        default :"Free"
      },
      phone: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      quantity: {
        type: Number,
        required: true,
      },
      razorpayBookingId: {
        type: String,
      },
      razorpayPaymentId: {
        type: String,
      },
      amount: {
        type: Number,
      },
      paymentMethod: {
        String: String,
      },
      qrCodeImage:{
         type: String,
      },
      Created_At: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const bookingModel = new mongoose.model("bookings", bookingSchema);
export default bookingModel;
