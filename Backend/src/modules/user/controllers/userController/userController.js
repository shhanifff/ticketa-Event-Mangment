import { generateToken } from "../../../utils/jwt.js";
import userModel from "../../models/userModel/userModel.js";
import { comparePassword, hashPassword } from "../../../utils/bycript.js";
import { OAuth2Client } from "google-auth-library";
import { sendOTP } from "../../../utils/sendMail.js";

// << ============================== userRegister ======================== >>
export const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res
      .status(400)
      .json({ success: false, message: `email already exist` });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new userModel({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  return res.status(201).json({ message: "User registered successfully" });
};

// << ============================== generate otp ======================== >>
export const generatetOTP = async (req, res) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email });

  if (!userExist) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  userExist.otp = otp;
  userExist.otpExpire = Date.now() + 10 * 60 * 1000;

  // ✅ Save changes to DB
  await userExist.save();

  await sendOTP(email, otp);
  return res.status(201).json({ message: "OTP sent to email" });
};

// << ============================== verify otp ======================== >>
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const userExist = await userModel.findOne({ email });

  if (!userExist) {
    return res.status(200).json({ message: "User Not found" });
  }

  if (userExist.otp !== otp || userExist.otpExpire < Date.now()) {
    return res
      .status(200)
      .json({ message: "Invalid OR Expired OTP", data: "WRONG" });
  }

  if (userExist.otp == otp) {
    userExist.otp = null;
    userExist.otpExpire = null;
    await userExist.save();

    return res.status(200).json({
      message: "OTP verified and user logged in successfully ",
      data: "OK",
    });
  }
};

//   << ============================== loginHandle ======================== >>
export const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const currentUser = await userModel.findOne({ email: email });

  if (!currentUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const passwordValidation = await comparePassword(
    password,
    currentUser.password
  );

  if (!passwordValidation) {
    return res.status(401).json({ message: "Password doesn't match" });
  }

  const token = generateToken(currentUser._id);
  console.log(token);

  if (currentUser.role === "admin") {
    return res.status(200).json({
      success: true,
      message: `admin loginned successfully`,
      data: currentUser,
      token,
    });
  }

  return res
    .status(200)
    .json({ message: "Login Success", data: currentUser, token });
};

//   << ============================== googleAuth ======================== >>
export const handleGoogleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(404).json({ message: "credential not found" });
  }
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // Get payload from verified token
  const payload = ticket.getPayload();

  const { email, name, picture } = payload;

  const existUser = await userModel.findOne({ email });

  if (existUser) {
    const token1 = generateToken(existUser._id);

    return res
      .status(201)
      .json({ message: "already registered", data: existUser, token1 });
  }

  const newUser = new userModel({
    username: name,
    email,
    regType :"Google",
    profileImage: picture,
  });

  const token = generateToken(newUser._id);

  await newUser.save();

  return res.status(201).json({
    message: "Login Successfully",
    data: newUser,
    token,
  });
};

//   << ============================== changes user Name ======================== >>
export const changeName = async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  console.log("user name and email :", name, email);
  console.log("user id :", userId);

  const currentUser = await userModel.findById(userId);

  if (!currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  currentUser.username = name;
  await currentUser.save();

  return res
    .status(200)
    .json({ message: "User name changed", data: currentUser.username });
};

//   << ============================== upload or chnage user profile ======================== >>
export const userProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID: ", userId);
    console.log("aaa", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profileImage and save
    currentUser.profileImage = req.file.path;
    await currentUser.save();

    return res.status(201).json({
      message: "Upload to Cloudinary done",
      url: req.file.path,
      data: currentUser,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
