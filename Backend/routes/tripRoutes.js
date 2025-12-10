import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/tripControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const triprouter = express.Router();
// Trip routes
triprouter.post("/", protect, createTrip);
triprouter.get("/", protect, getTrips);
triprouter.get("/:id", protect, getTripById);
triprouter.put("/:id", protect, updateTrip);
triprouter.delete("/:id", protect, deleteTrip);
export default triprouter;
