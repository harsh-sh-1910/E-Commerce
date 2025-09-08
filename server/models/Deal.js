const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  time: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

module.exports = mongoose.model("Deal", dealSchema);
