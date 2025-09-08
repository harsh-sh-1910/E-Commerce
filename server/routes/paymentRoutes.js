const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// ======================
// Razorpay instance
// ======================
const razorpay = new Razorpay({
  key_id: "rzp_test_3WbPzeexWFf3Wx",
  key_secret: "rmqFwXefGDhqePUbLLjIBRtL",
});

// ======================
// Fetch Shiprocket token dynamically
// ======================
async function getShiprocketToken() {
  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );
  return res.data.token;
}

// ======================
// Create Razorpay Order
// ======================
router.post("/", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ======================
// Verify Payment + Create Shiprocket Order + Assign AWB
// ======================
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("=== Payment Verification Started ===");
    console.log("Request Body:", req.body);

    // 1. Verify Razorpay signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "rmqFwXefGDhqePUbLLjIBRtL")
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      console.error("Invalid signature");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature" });
    }

    res.status(200).json({
      success: true,
      message: "Payment Verified & Order Created",
    });
  } catch (error) {
    console.error("Server Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Order processing failed",
      error: error.message,
    });
  }
});

module.exports = router;
