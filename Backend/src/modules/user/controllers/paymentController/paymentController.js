import mongoose from "mongoose";
import razorpayInstance from "../../../config/razorpay.js";

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(404)
        .json({ success: false, message: `user not valid` });

    const { currency, price } = req.body;

    const reciept = `receipt_${Date.now()}`;

    const options = {
      amount: price,
      currency,
    };

    try {
      const booking = await razorpayInstance.orders.create(options);
      console.log("order", booking);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: `booking not found` });
      }

      res.status(200).json({
        success: true,
        message: `payment booking created successfully`,
        data: booking,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `failed to create order ${err}` });
  }
};

export const getKey =async (req,res)=>{
     res.status(201).json({key : process.env.RAZORPAY_KEY_ID})
}

export const verifyBookingPayment = async (req, res) => {
  const { userId } = req.params;
  console.log("payment verification");
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    email,
    phone,
    quantity,
  } = req.body;
  //   console.log(Address);
  console.log("req body", req.body);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ success: false, message: `user not valid` });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  return res.status(201).json({ message: "Payement verification completed" });
};
