const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = require("express").Router();

router.route("/").post(createOrder);
router.route("/").get(getAllOrders);
router.route("/:id").get(getSingleOrder);
router.route("/:id").patch(updateOrder);
router.route("/:id").delete(deleteOrder);

module.exports = router;
