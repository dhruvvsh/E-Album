import express from "express";
import {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} from "../controllers/memoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const memoryrouter = express.Router();
// Memory routes
memoryrouter.post("/", protect, createMemory);
memoryrouter.get("/", protect, getMemories);
memoryrouter.get("/:id", protect, getMemoryById);
memoryrouter.put("/:id", protect, updateMemory);
memoryrouter.delete("/:id", protect, deleteMemory);
export default memoryrouter;
