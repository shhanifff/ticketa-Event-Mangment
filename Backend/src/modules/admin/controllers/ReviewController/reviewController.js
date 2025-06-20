import reviewModel from "../../../user/models/reviewModel/reviewModel.js";

export const deleteReview = async (req, res) => {
  const { id } = req.body;
  const deletedReview = await reviewModel.findByIdAndDelete(id);

  if (!deletedReview) {
    return res.status(404).json({ message: "Review not found" });
  }

  res
    .status(200)
    .json({ message: "Review deleted successfully", deletedReview });
};
