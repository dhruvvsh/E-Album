import express from "express";
import {
  createMemory,
  getMemories,
  getMemoriesByTrip,
  updateMemory,
  deleteMemory,
} from "../controllers/memoryControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const memoryrouter = express.Router();
// Memory routes
memoryrouter.post("/", protect, createMemory);
memoryrouter.get("/", protect, getMemories);
memoryrouter.get("/:id", protect, getMemoriesByTrip);
memoryrouter.put("/:id", protect, updateMemory);
memoryrouter.delete("/:id", protect, deleteMemory);
export default memoryrouter;
