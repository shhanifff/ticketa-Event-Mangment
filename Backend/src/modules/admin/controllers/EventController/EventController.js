import mongoose from "mongoose";
import eventModel from "../../models/eventsModel/eventsModel.js";
import { getIo } from "../../../../../socket.js";
import NotificationModel from "../../../user/models/NotificationModel/NotificationModel.js";
import userModel from "../../../user/models/userModel/userModel.js";

// << =================== addEvent ================== >>
export const addEvents = async (req, res) => {
  const {
    title,
    date,
    description,
    time,
    category,
    location,
    ticketType,
    availableSeats,
    price,
    // eventImage
  } = req.body;

  console.log("title", title);

  console.log("req.body", req.body);



  console.log("img url", req.file);

  const eventExist = await eventModel.findOne({ title });

  if (eventExist) {
    return res.status(400).json({ message: "Event already exists" });
  }

  const newEvent = new eventModel({
    title,
    date,
    description,
    time,
    category,
    location,
    ticketType,
    availableSeats,
    price,
    banner: req.file.path, // multer stores file path here
  });

  await newEvent.save();

  const allUser = await userModel.find();

  const usersRead = allUser.map((user) => ({
    userId: user._id,
    isRead: false,
  }));

  const newNotifcations = new NotificationModel({
    event_title: newEvent.title,
    event_id: newEvent._id,
    event_description: newEvent.description,
    usersRead: usersRead,
  });

  console.log("Saved Notification:", newNotifcations);

  await newNotifcations.save();

  const io = getIo();
  io.emit("notification", {
    title: newEvent.title,
    message: `New event "${newEvent.title}" added! Book your tickets now.`,
    eventId: newEvent._id,
  });

  return res
    .status(201)
    .json({ message: "Event Created successfully", data: newEvent });
};

// << =================== editEvent ================== >>
export const editEvent = async (req, res) => {
  const { eventId } = req.params;

  console.log("ID received:", eventId);
  console.log("Image file:", req.file);
  console.log("req.body:", req.body);

 

  if (!mongoose.isValidObjectId(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  // Check if event exists
  const currentEvent = await eventModel.findById(eventId);
  if (!currentEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

   const allUser = await userModel.find();

  const usersRead = allUser.map((user) => ({
    userId: user._id,
    isRead: false,
  }));

  // If image uploaded, attach to req.body
  if (req.file && req.file.path) {
    req.body.banner = req.file.path;
  }

  // Update using merged body (text + optional image)
  const updatedEvent = await eventModel.findByIdAndUpdate(
    eventId,
    { $set: req.body },
    { new: true }
  );

  const io = getIo();
  io.emit("notification", {
    title: updatedEvent.title,
    message: `Event "${updatedEvent.title}" has been rescheduled. Check new details.`,
    eventId,
  });

   const newNotifcations = new NotificationModel({
    event_title: updatedEvent.title,
    event_id: updatedEvent._id,
    event_description: updatedEvent.description,
    usersRead: usersRead,
  });

  console.log("Saved Notification:", newNotifcations);

  await newNotifcations.save();

  // console.log("Updated event:", updatedEvent);

  return res.status(200).json({
    message: "Event updated successfully",
    data: updatedEvent,
  });
};

// << =================== editEvent ================== >>

export const deleteEvent = async (req, res) => {
  const { id } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  const deletedEvent = await eventModel.findByIdAndDelete(id);

  if (!deletedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.status(201).json({ message: "Event deleted successfully" });
};

// << =================== getEvents ================== >>

export const getEvents = async (req, res) => {
  const allEvents = await eventModel.find();
  if (!allEvents) {
    return res.json(404).json({ message: "Events not Found" });
  }
  return res
    .status(201)
    .json({ message: "All events fetched", data: allEvents });
};
