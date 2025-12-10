import express from "express";
import {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} from "../controllers/memoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// Memory routes
router.post("/", protect, createMemory);
router.get("/trip/:tripId", protect, getMemories);
router.get("/:id", protect, getMemoryById);
router.put("/:id", protect, updateMemory);
router.delete("/:id", protect, deleteMemory);
export default router;
