import reviewModel from "../../models/reviewModel/reviewModel.js";
import userModel from "../../models/userModel/userModel.js";

export const addReview = async (req, res) => {
  const { userId, review, rating } = req.body;
  const obj = {
    userId,
    review,
    rating,
  };

  const userDetails = await userModel.findById(userId);

  const newReview = new reviewModel({
    userId,
    review,
    rating,
    profileImage: userDetails.profileImage,
  });

  await newReview.save();

  console.log(obj);
  return res
    .status(201)
    .json({ message: "Review Created", data: { review, rating } });
};

export const getReviws = async (req, res) => {
  const allReviews = await reviewModel.find().populate("userId");

  if (!allReviews) {
    return res.status(404).json({ message: "Reviews not Found" });
  }

  return res
    .status(201)
    .json({ message: "all review geted", data: allReviews });
};
