const {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// 📂 Set up multer storage config
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
    fileSize: 10 * 1024 * 1024,
  },
});

router.route("/").post(upload.single("image"), createCategory); // ⬅️ Multer middleware here
router.route("/").get(getAllCategory);
router.route("/:id").patch(updateCategory);
router.route("/:id").delete(deleteCategory);

module.exports = router;
