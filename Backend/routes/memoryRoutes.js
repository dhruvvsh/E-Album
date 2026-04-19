import express from "express";
import {
  createMemory,
  getMemories,
  getMemoriesByTrip,
  updateMemory,
  deleteMemory,
  toggleFavorite,
  deleteMemoryGroup,
} from "../controllers/memoryControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const memoryrouter = express.Router();

// Create memory
memoryrouter.post("/", protect, createMemory);

// Get all memories
memoryrouter.get("/", protect, getMemories);

// Get memories by trip
memoryrouter.get("/trip/:tripId", protect, getMemoriesByTrip);

// Toggle favorite
memoryrouter.put("/:id/favorite", protect, toggleFavorite);

// Update memory
memoryrouter.put("/:id", protect, updateMemory);

// Delete multiple memories (for memory group deletion)
memoryrouter.delete("/group", protect, deleteMemoryGroup);

// Delete memory
memoryrouter.delete("/:id", protect, deleteMemory);


export default memoryrouter;
