import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../model/User.js";

// create instance of razorpay
export const razorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.KEY,
    key_secret: process.env.SECRET_KEY,
  });
};

export const createOrder = async (req, res) => {
  // creating instance
  const razorpay = razorpayInstance();
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 1,
  };
  // creating order
  try {
    const response = await razorpay.orders.create(options);
    console.log("test");
    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

// sending api key
export const sendApikey = async (req, res) => {
  return res.status(200).json({ sucess: true, key: process.env.KEY });
};

// payment verification
export const verification = async (req, res) => {
  // console.log(req.body);
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature ,userId,contestnumber} =
    req.body;
    // console.log(userId,contestnumber)
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId || !contestnumber) {
    return res.status(400).json({ success: false, message: "some fields are missing" });
  }
    const user=await User.findById({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  user.count = user.count + contestnumber;
  user.poll = user.poll + contestnumber;
  user.isAdmin = true;
  await user.save(); // Save the updated user document
  const body = razorpay_payment_id + "|" + razorpay_order_id;
  const sign = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  if (sign === razorpay_signature)
    return res
      .status(200)
      .json({
        success: true,
        message: "payment verification sucessfull",
        reference: razorpay_payment_id,
      });


  return res
    .status(200)
    .json({ success: false, message: "payment verification failed" });
};
// testing webhook method

export const webhook = async (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const razorpaySignature = req.headers["x-razorpay-signature"];

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const { userId, contestnumber } = payment.notes || {};

    if (!userId || !contestnumber) {
      return res.status(400).json({ message: "Missing data in notes" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
     console.log(user);
      // const votes = parseInt(contestnumber, 10);
      user.count += contestnumber||1;
      user.poll += contestnumber|| 1; 
      user.isAdmin = true;

      await user.save();
      return res.status(200).json({ success: true, message: "User updated" });
    } catch (err) {
      console.error("Webhook error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(200).json({ status: "ignored" });
};


