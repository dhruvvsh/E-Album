import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  joinTrip,
} from "../controllers/tripControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { inviteParticipant } from "../controllers/inviteParticipant.js";

const triprouter = express.Router();

// Create / List
triprouter.post("/", protect, createTrip);
triprouter.get("/", protect, getTrips);

// Invite & Join
triprouter.post("/join/:token", protect, joinTrip);
triprouter.post("/:id/invite", protect, inviteParticipant);

// Trip by ID
triprouter.get("/:id", protect, getTripById);
triprouter.put("/:id", protect, updateTrip);
triprouter.delete("/:id", protect, deleteTrip);

export default triprouter;
