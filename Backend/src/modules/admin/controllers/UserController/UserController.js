import mongoose from "mongoose";
import userModel from "../../../user/models/userModel/userModel.js";

// << =================== getUsers ======================= >>
export const getUsers = async (req, res) => {
  const allUsers = await userModel.find();
  if (!allUsers) {
    return res.status(404).json({ message: "Users Not Found" });
  }

  return res.status(201).json({ message: "Get all users", data: allUsers });
};

// << =================== block and unblock ======================= >>

export const BlockAndUnblock = async (req, res) => {
  const { action, id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  console.log("Action:", action, "User ID:", id);

  const currentUser = await userModel.findById(id);

  if (!currentUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  if (action === "block") {
    currentUser.isBlocked = true;
  } else if (action === "unblock") {
    currentUser.isBlocked = false;
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  await currentUser.save();

  return res.status(200).json({
    message: `User has been ${action}ed successfully`,
    data: currentUser.isBlocked,
  });
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  console.log(id);

  const currentUser = await userModel.findById(id);

  if (!currentUser) {
    return res.status(404).json({ message: "User Not Found " });
  }

  await userModel.findByIdAndDelete(id);

  return res.status(201).json({ message: "User Delete Successfully" });
};
