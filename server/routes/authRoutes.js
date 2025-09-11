const {
  register,
  getAllUsers,
  updateUser,
  login,
  refresh,
  logout,
  getSingleUser,
  googleLogin,
} = require("../controllers/authController");

const router = require("express").Router();

// ===== AUTH ROUTES =====
router.post("/register", register);
router.post("/login", login);
router.route("/google-login").post(googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

// ===== USER ROUTES =====
router.get("/", getAllUsers); // GET all users
router.get("/:id", getSingleUser); // GET single user by ID
router.put("/:id", updateUser); // UPDATE user
// (You can also add router.delete("/:id") if needed)

module.exports = router;
