const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductByCategory,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // ✅ 25 MB per file
    fieldSize: 25 * 1024 * 1024, // ✅ 25 MB per text field
    fields: 50, // (optional) max number of text fields
    files: 50, // (optional) max number of files
  },
});

// Accept any files, then categorize them in controller
const uploadProductImages = upload.any();

// MAIN PRODUCT ROUTES
router.route("/").post(uploadProductImages, createProduct).get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(uploadProductImages, updateProduct)
  .delete(deleteProduct);

router.route("/category/:categoryId").get(getProductByCategory);

module.exports = router;
