import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (user only)
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Admin-only route
router.get("/admin-data", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "This is admin-only data" });
});

// Route accessible to user + admin
router.get(
  "/dashboard",
  protect,
  authorizeRoles("user", "admin"),
  (req, res) => {
    res.json({ message: "Dashboard for both user & admin" });
  }
);

export default router;
