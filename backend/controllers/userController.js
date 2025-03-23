// controllers/userController.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "my_super_secret_key";
const User = require("../models/User");

// Register
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });
  res.json({ token });
};

// Get user info
exports.getUserInfo = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

// Protected test route
exports.protectedTest = (req, res) => {
  res.json({ message: `Protected route, your user ID is ${req.userId}` });
};
