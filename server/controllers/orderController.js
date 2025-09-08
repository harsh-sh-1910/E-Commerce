const Order = require("../models/Order");
// create order
// post
const createOrder = async (req, res) => {
  try {
    const {
      payment,
      fullfillment,
      customerInfo,
      orderDetail,
      summary,
      orderNote,
      orderNumber,
    } = req.body;

    // Validate required fields
    if (
      !payment ||
      !payment.razorpay_order_id ||
      !payment.razorpay_payment_id ||
      !customerInfo ||
      !orderDetail ||
      !summary
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    // Validate customerInfo
    const requiredCustomerFields = [
      "name",
      "address",
      "city",
      "phNo",
      "postalCode",
      "email",
      "country",
    ];
    for (const field of requiredCustomerFields) {
      if (!customerInfo[field]) {
        return res
          .status(400)
          .json({ message: `Customer ${field} is required.` });
      }
    }

    // Optional: customerId support
    const customerId = customerInfo.customerId || null;

    // Validate orderDetail
    if (!Array.isArray(orderDetail) || orderDetail.length === 0) {
      return res.status(400).json({ message: "Order details are required." });
    }

    for (const item of orderDetail) {
      if (
        !item.name ||
        typeof item.quantity !== "number" ||
        typeof item.price !== "number" ||
        typeof item.totalPrice !== "number"
      ) {
        return res.status(400).json({
          message:
            "Each order item must include name, quantity (number), price (number), and totalPrice (number).",
        });
      }
    }

    // Validate summary
    const requiredSummaryFields = ["subTotal", "shipping", "tax", "grandTotal"];
    for (const field of requiredSummaryFields) {
      if (typeof summary[field] !== "number") {
        return res.status(400).json({
          message: `Summary ${field} must be a number.`,
        });
      }
    }

    // Save order
    const order = new Order({
      payment: {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        status: payment.status || "Paid",
        method: payment.method || "Razorpay",
      },
      fullfillment: {
        status: fullfillment?.status || "Pending",
        method: fullfillment?.method || "Standard",
      },
      customerInfo: {
        ...customerInfo,
        customerId, // Optional
      },
      orderDetail,
      summary,
      orderNote,
      orderNumber,
    });

    await order.save();

    res.status(201).json({
      message: "✅ Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all order
// get
const getAllOrders = async (req, res) => {
  try {
    const data = await Order.find({});
    if (!data.length) {
      return res.status(400).json({ message: "NO ORDER EXISTS" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single order
// get
const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "ORDER DOESN'T EXISTS" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update order
// patch
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment, fullfillment, customerInfo, price, orderDetail, summary } =
      req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "ORDER DOESN'T EXISTS" });
    }
    order.payment = payment;
    order.fullfillment = fullfillment;
    order.customerInfo = customerInfo;
    order.price = price;
    order.orderDetail = orderDetail;
    order.summary = summary;

    await order.save();

    res.status(200).json({ message: "ORDER UPDATED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// delete order
// delete
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "ORDER DOESN'T EXISTS" });
    }
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ message: "ORDER SUCCESSFULLY DELETED" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
