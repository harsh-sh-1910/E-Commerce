const Deal = require("../models/Deal");

const createDeal = async (req, res) => {
  try {
    const { productName, time, discount } = req.body;

    // ✅ Check for all required fields
    if (!productName || !time || discount === undefined) {
      return res.status(400).json({ message: "ALL FIELDS ARE REQUIRED" });
    }

    // ✅ Optional: validate discount is a number
    if (typeof discount !== "number" || isNaN(discount)) {
      return res
        .status(400)
        .json({ message: "Discount must be a valid number" });
    }

    const duplicate = await Deal.findOne({ productName });
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "DEAL ALREADY EXISTS FOR THIS PRODUCT" });
    }

    const newDeal = new Deal({
      productName,
      time,
      discount, // ✅ You were missing this line
    });

    await newDeal.save();
    return res.status(200).json({ message: "DEAL CREATED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/deals
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find().populate("productName"); // assuming productName is ObjectId
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, time } = req.body;
    const deal = await Deal.findById(id);
    if (!deal) {
      return res
        .status(400)
        .json({ message: "NO DEAL EXIST FOR THIS PRODUCT" });
    }
    deal.productName = productName;
    deal.time = time;

    await deal.save();
    return res.status(200).json({ message: "DEAL UPDATED SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Deal.findById(id);
    if (!data) {
      return res.status(200).json({ message: "NO DEAL EXISTS" });
    }
    await Deal.findByIdAndDelete(id);
    return res.status(200).json({ message: "DEAL SUCCESSFULLY DELETED" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDeal, getAllDeals, updateDeal, deleteDeal };
