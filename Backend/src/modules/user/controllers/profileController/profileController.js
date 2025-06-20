
import bookingModel from "../../models/bookingModel/bookingModel.js";
import userModel from "../../models/userModel/userModel.js";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const currentUserDetails = await userModel.findById(userId);
  if (!currentUserDetails) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const currentUserBooking = await bookingModel
    .findOne({ userId })
    .populate("userId")
    .populate("bookings.eventId");

  const response = {
    user: currentUserDetails,
    bookings: currentUserBooking ? currentUserBooking : [],
  };

  return res
    .status(200)
    .json({ message: "Profile fetched successfully", data: response });
};
