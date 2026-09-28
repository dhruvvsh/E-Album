import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";

// SIGNUP
export const registerUser = async (req, res) => {
  try{
  const { username, email, password } = req.body;

  if (![username, email, password].every((v) => typeof v === "string" && v.trim())) {
    return res.status(400).json({ message: "Username, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Check existing user
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.json({
    message: "User registered successfully",
    user,
    token: generateToken(user._id),
  });
} catch (error) {
  res.status(500).json({ message: "Server Error", error: error.message });
}
}; 

// LOGIN
export const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;

  // reject objects like {"$gt": ""} (NoSQL injection)
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Same response for unknown email and wrong password (no user enumeration)
  const user = await User.findOne({ email });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    message: "Login successful",
    user,
    token: generateToken(user._id),
  });
} catch (error) {
  res.status(500).json({ message: "Server Error", error: error.message });
}
};
