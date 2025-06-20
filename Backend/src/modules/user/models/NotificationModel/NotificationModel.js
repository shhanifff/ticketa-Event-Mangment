import mongoose from "mongoose";

const notificationSchem = mongoose.Schema(
  {
    usersRead: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        isRead: { type: Boolean, default: false },
      },
    ],
    event_title: {
      type: String,
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "events",
    },
    event_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("notifcations", notificationSchem);
export default NotificationModel;
