import mongoose from "mongoose";
import bookingModel from "../../models/bookingModel/bookingModel.js";
import eventModel from "../../../admin/models/eventsModel/eventsModel.js";
import { sendEventTicket } from "../../../utils/sendMail.js";
import QRCode from "qrcode";
// import { checkUserId } from "../../service/bookingService.js";


export const handleBooking = async (req, res) => {
  const {
    userId,
    id,
    quantity,
    phone,
    email,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    amount,
    paymentMethod,
  } = req.body;

  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Event ID" });
  }

  // await checkUserId(id)

  const currentEvent = await eventModel.findById(id);

  if (!currentEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (Number(currentEvent.availableSeats) < quantity) {
    return res.status(400).json({ message: "Not enough seats available" });
  }

  const bookingId = `${userId}-${id}-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const qrCodeData = `localhost:5173/booking/${bookingId}`;
  const qrCodeImage = await QRCode.toDataURL(qrCodeData);

  const currentUserBooking = await bookingModel.findOne({ userId });

  if (currentUserBooking) {
    currentUserBooking.bookings.push({
      eventId: id,
      bookingId,
      phone,
      email,
      quantity,
      razorpayOrderId,
      razorpayPaymentId,
      amount,
      paymentMethod,
      qrCodeImage
    });

    sendEventTicket(email, qrCodeImage, bookingId);
    currentEvent.availableSeats -= quantity;
    await currentEvent.save();
    await currentUserBooking.save();
  } else {
    const newBooking = new bookingModel({
      userId,
      bookings: [
        {
          eventId: id,
          bookingId,
          phone,
          email,
          quantity,
          razorpayOrderId,
          razorpayPaymentId,
          amount,
          paymentMethod,
        },
      ],
    });

    sendEventTicket(email, qrCodeImage, bookingId);
    await newBooking.save();
    currentEvent.availableSeats -= quantity;
    await currentEvent.save();
  }

  return res.status(201).json({ message: "Booking Successfully Completed" });
};

export const qrDetails = async (req, res) => {
  const { userId } = req.body;

  console.log("user id", userId);

  const currentUser = await bookingModel.findOne({ userId: userId });

  if (!currentUser) {
    return res.status(201).json({ message: "User not Found" });
  }

  return res
    .status(201)
    .json({ message: "User event booking", data: currentUser });
};
