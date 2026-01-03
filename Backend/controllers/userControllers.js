import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";

// SIGNUP
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

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
  });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    user,
    token: generateToken(user._id),
  });
};
