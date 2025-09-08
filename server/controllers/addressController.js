const Address = require("../models/Address");

// Add new address
const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      phone,
      isDefault,
      userId,
    } = req.body;
    // const userId = req.userId;
    // console.log(req.userId);
    if (userId !== req.userInfo.id) {
      return res.status(400).json({ message: "WRONG USER" });
    }

    // If setting this as default, unset others
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    // If it's the first address, set as default
    const existingCount = await Address.countDocuments({ userId });
    const newAddress = new Address({
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      phone,
      isDefault: existingCount === 0 ? true : isDefault,
      userId,
    });

    await newAddress.save();
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const userId = req.userId || "66c58e9b3a90f0a123456789";
    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove address
const removeAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Address removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || "66c58e9b3a90f0a123456789";

    // Unset all defaults first
    await Address.updateMany({ userId }, { isDefault: false });
    const updated = await Address.findByIdAndUpdate(
      id,
      { isDefault: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { addAddress, setDefaultAddress, removeAddress, getAddresses };
