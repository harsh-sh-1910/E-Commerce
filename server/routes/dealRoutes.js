const {
  createDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

const router = require("express").Router();

router.route("/").post(createDeal);
router.route("/").get(getAllDeals);
router.route("/:id").patch(updateDeal);
router.route("/:id").delete(deleteDeal);

module.exports = router;
