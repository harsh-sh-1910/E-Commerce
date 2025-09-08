const {
  register,
  getAllUsers,
  updateUser,
  login,
  refresh,
  logout,
  getSingleUser,
} = require("../controllers/authController");

const router = require("express").Router();

router.route("/").post(register);
router.route("/").get(getAllUsers);
router.route("/:id").put(updateUser);
router.route("/:id").get(getSingleUser);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);

module.exports = router;
