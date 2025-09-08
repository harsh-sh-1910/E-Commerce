const express = require("express");
const {
  addAddress,
  getAddresses,
  removeAddress,
  setDefaultAddress,
} = require("../controllers/addressController.js");
const verifyJWT = require("../middlewares/verifyJWT.js");

const router = express.Router();

// GET all addresses
router.get("/", getAddresses);

// POST add address
router.post("/", verifyJWT, addAddress);

// DELETE remove address
router.delete("/:id", removeAddress);

// PUT set default address
router.put("/:id/default", setDefaultAddress);

module.exports = router;
