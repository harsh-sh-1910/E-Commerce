const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    payment: {
      razorpay_order_id: { type: String, required: true },
      razorpay_payment_id: { type: String, required: true },
      status: {
        type: String,
        enum: ["Paid", "Failed", "Pending"],
        default: "Paid",
      },
      method: {
        type: String,
        default: "Razorpay",
      },
    },
    fullfillment: {
      status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
      method: {
        type: String,
        enum: ["Standard", "Express", "Pickup"],
        default: "Standard",
      },
    },
    customerInfo: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: false, // optional if guest checkout
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phNo: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    orderDetail: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false, // optional if not saved in catalog
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    summary: {
      subTotal: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      grandTotal: {
        type: Number,
        required: true,
      },
    },
    orderNote: {
      type: String,
      default: "",
    },
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
