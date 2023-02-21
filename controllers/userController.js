const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all gaps");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists, please log in");
  }

  // Password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be greater than 6 characters");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 864000), // 1Day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email } = user;
    res.status(201).json({
      id: _id,
      name,
      email,
    });
  }
});

// Login USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all the gaps");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(404);
    throw new Error("User doesn't exist, please sign up!");
  }

  // Check if password is correct
  const pwIsCorrect = await bcrypt.compare(password, userExists.password);

  const token = generateToken(userExists._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 864000), // 1Day
    sameSite: "none",
    secure: true,
  });

  if (userExists && pwIsCorrect) {
    const { _id, email, name } = userExists;
    res.status(200).json({
      id: _id,
      email,
      name,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Logout USER
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Sucessfully logged out" });
});

// Get USER data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { name, email, photo } = req.user;
  return res.status(200).json({
    name,
    email,
    photo,
  });
});

// Get login status
const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  // Check
  if (!token) {
    return res.json(false);
  }

  if (token) {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(true);
    } else {
      return res.status(false);
    }
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getLoginStatus,
};
