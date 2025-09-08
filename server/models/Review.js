const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    uName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    verifiedPurchase: {
      // ✅ NEW: Mark review as verified if ordered by user
      type: Boolean,
      default: false,
    },
    orderId: {
      // ✅ OPTIONAL: For future use, track which order this review came from
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
