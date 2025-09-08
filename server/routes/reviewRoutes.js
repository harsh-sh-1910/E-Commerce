const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getReviewByProductId,
} = require("../controllers/reviewController");

const router = require("express").Router();

router.route("/").post(createReview);
router.route("/").get(getAllReviews);
// router.route("/:id").get(getSingleReview);
router.route("/:id").get(getReviewByProductId);
router.route("/:id").patch(updateReview);
router.route("/:id").delete(deleteReview);

module.exports = router;
