import bookingModel from "../../../user/models/bookingModel/bookingModel.js"




export const allBooking = async (req, res) => {
  try {
    const all_booking = await bookingModel
      .find()
      .populate("userId") // populate full user data
      .populate("bookings.eventId"); // populate full event data

    return res.status(200).json({
      message: "All bookings with user and event details",
      data: all_booking,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
