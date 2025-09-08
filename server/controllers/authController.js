const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register user
// desc post
const register = async (req, res) => {
  try {
    const { uName, fName, lName, email, phone, password } = req.body;

    // --- Basic validation
    if (!uName || !fName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // --- Check duplicate username
    const existingUser = await User.findOne({ uName });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // --- Optional: Validate phone number format (10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
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
      isAdmin: false, // default
    });

    await user.save();

    // --- Return success response
    res
      .status(201)
      .json({ message: "User successfully created", uName: user.uName });
  } catch (error) {
    // --- Handle Mongo duplicate key error if unique index is enforced
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

// get all users
// desc get
const getAllUsers = async (req, res) => {
  try {
    const data = await User.find({});

    if (!data.length) {
      return res.status(400).json({ message: "Customer not exists" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await User.findOne({ _id: id }).select("-password -isAdmin");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
    console.log(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// update user
// desc patch
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const { fName, lName, email, phone } = req.body;

    user.fName = fName;
    user.lName = lName;
    user.email = email;
    user.phone = phone;

    await user.save();

    res.status(200).json({ message: "Customer Successfully Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// login
const login = async (req, res) => {
  try {
    const { uName, password } = req.body;
    if (!uName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ uName });
    if (!user) {
      return res.status(400).json({ error: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Username or Password" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        admin: user.isAdmin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1y" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// refresh
const refresh = async (req, res) => {
  try {
    const { cookies } = req;

    if (!cookies) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const refreshToken = cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const foundUser = await User.findById(decoded.id);

          const accessToken = jwt.sign(
            { id: foundUser._id, admin: foundUser.isAdmin },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          res.json(accessToken);
        } catch (error) {
          res.status(500).json({ message: "Server Error" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// logout
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies) {
      return res.sendStatus(204);
    }

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    res.json({ message: "Cookie Cleared Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  getAllUsers,
  getSingleUser,
  updateUser,
  login,
  refresh,
  logout,
};
