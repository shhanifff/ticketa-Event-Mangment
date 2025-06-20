import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  regType :{
    type:String,
    default :"Normal"
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "CEO"],
  },
  otp: {
    type: String,
  },
  otpExpire: {
    type: Date,
    default: 0,
  },
  created_At: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("users", userSchema);
export default userModel;
