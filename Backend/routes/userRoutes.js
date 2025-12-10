import express from "express";
import { registerUser, loginUser } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const userrouter = express.Router();
//Login and Register routes
userrouter.post("/register", registerUser);
userrouter.post("/login", loginUser);

// Protected route
userrouter.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default userrouter;
