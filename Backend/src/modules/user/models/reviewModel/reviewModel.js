import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  created_At: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
  },
});

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;
