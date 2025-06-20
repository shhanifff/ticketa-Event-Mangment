import NotificationModel from "../../models/NotificationModel/NotificationModel.js";
import userModel from "../../models/userModel/userModel.js";

export const addNotification = async (req, res) => {
  console.log("item details ", req.body);
  const { event_title, event_id, event_description } = req.body;

  const allUser = await userModel.find();

  const usersRead = allUser.map((user) => ({
    userId: user._id,
    isRead: false,
  }));

  const newNotifcations = new NotificationModel({
    event_title,
    event_id,
    event_description,
    usersRead: usersRead,
  });

  console.log("Saved Notification:", newNotifcations);

  await newNotifcations.save();

  return res
    .status(201)
    .json({ message: "Nofication Created", data: newNotifcations });
};

export const getNotification = async (req, res) => {
  const allNofications = await NotificationModel.find();
  if (!allNofications) {
    return res.status(404).json({ message: "Notifcations Not Found" });
  }

  return res
    .status(201)
    .json({ message: "All Nofications", data: allNofications });
};

export const markAsRead = async (req, res) => {
  const { userId } = req.params;
  console.log("user id geted", userId);

 // Get all notifications from DB
 const notifications = await NotificationModel.find();

 // Loop through each notification
 for (let notification of notifications) {
   // Loop through each user in usersRead array
   for (let userRead of notification.usersRead) {
     // Check if userId matches and isRead is false
     if (userRead.userId.toString() === userId && !userRead.isRead) {
       // Change isRead to true
       userRead.isRead = true;
       console.log(`Marked as read for userId: ${userId}`);
     }
   }

   // Save the notification if any changes were made
   await notification.save();
 }
  // ✅ Corrected here: use notifications instead of markAsRead
  return res.status(201).json({ message: "Done", data: notifications });
};
