const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================= REGISTER =============================
const register = async (req, res) => {
  try {
    const { uName, fName, lName, email, phone, password } = req.body;

    if (!uName || !fName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // --- Check duplicate username or email
    const existingUser = await User.findOne({ $or: [{ uName }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    // --- Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // --- Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // --- Strong password (min 6 chars)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // --- Hash password
    const hashPass = await bcrypt.hash(password, 10);

    // --- Create user
    const user = new User({
      uName,
      fName,
      lName,
      email,
      phone,
      password: hashPass,
      isAdmin: false,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "User successfully created", uName: user.uName });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // frontend sends Google ID token
    if (!token) return res.status(400).json({ error: "Google token required" });

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, given_name, family_name } = payload;

    // --- Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = new User({
        uName: email.split("@")[0],
        fName: given_name,
        lName: family_name || "",
        email,
        phone: "",
        password: "", // not required for Google login
        isAdmin: false,
      });
      await user.save();
    }

    // --- Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, uName: user.uName, admin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, uName: user.uName },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Google login successful",
      accessToken,
      user: {
        id: user._id,
        uName: user.uName,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================= GET ALL USERS =============================
const getAllUsers = async (req, res) => {
  try {
    const data = await User.find({}).select("-password");
    if (!data.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================= GET SINGLE USER =============================
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -isAdmin");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================= UPDATE USER =============================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fName, lName, email, phone } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fName = fName || user.fName;
    user.lName = lName || user.lName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.status(200).json({ message: "User successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================= LOGIN =============================
const login = async (req, res) => {
  try {
    const { uName, email, password } = req.body;
    if ((!uName && !email) || !password) {
      return res
        .status(400)
        .json({ error: "Username/Email and password are required" });
    }

    const user = await User.findOne({ $or: [{ uName }, { email }] });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid Username/Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid Username/Email or Password" });
    }

    const accessToken = jwt.sign(
      { id: user._id, admin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        uName: user.uName,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================= REFRESH =============================
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await User.findById(decoded.id);
        if (!foundUser)
          return res.status(404).json({ message: "User not found" });

        const accessToken = jwt.sign(
          { id: foundUser._id, admin: foundUser.isAdmin },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================= LOGOUT =============================
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  getAllUsers,
  getSingleUser,
  updateUser,
  login,
  googleLogin,
  refresh,
  logout,
};
