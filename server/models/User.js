const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uName: {
      type: String,
      required: true,
    },
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },

    password: {
      type: String,
    },
    orders: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
