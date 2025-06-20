import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Music", "Food Expo", "Sports", "Arts", "Business", "Workshop"],
  },
  banner: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
    enum: ["Free", "Paid"],
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  created_At: {
    type: Date,
    default: Date.now,
  },
});

const eventModel = mongoose.model("events", eventSchema);
export default eventModel;
