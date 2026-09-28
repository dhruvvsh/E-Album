import Memory from "../models/memoriesModel.js";
import Trip from "../models/tripModel.js";
import { destroyImages } from "../utils/cloudinary.js";
import { isParticipant } from "../utils/tripAccess.js";

// CREATE MEMORY
export const createMemory = async (req, res) => {
  try {
    const { tripId, image, description, caption, location } = req.body;
    const author = req.user._id;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Only participants can add memories
    if (!isParticipant(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newMemory = new Memory({
      tripId,
      image,
      description,
      caption: caption || description, // If no caption provided, use description
      location,
      author,
      isFavorite: [],
    });

    const savedMemory = await newMemory.save();
    await savedMemory.populate("author", "username email");

    res.status(201).json(savedMemory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL MEMORIES
export const getMemories = async (req, res) => {
  try {
    const myTrips = await Trip.find({ participants: req.user._id }).select("_id");
    const memories = await Memory.find({ tripId: { $in: myTrips.map((t) => t._id) } })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET MEMORIES BY TRIP ID
export const getMemoriesByTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Check access
    if (trip.isPrivate && !isParticipant(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const memories = await Memory.find({ tripId: req.params.tripId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// TOGGLE FAVORITE
export const toggleFavorite = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });

    const trip = await Trip.findById(memory.tripId);
    if (!trip || !isParticipant(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user._id;
    const isFavorited = memory.isFavorite.some((id) => id.toString() === userId.toString());

    if (isFavorited) {
      // Remove from favorites
      memory.isFavorite = memory.isFavorite.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // Add to favorites
      memory.isFavorite.push(userId);
    }

    await memory.save();
    await memory.populate("author", "username email");

    res.json({
      message: isFavorited ? "Removed from favorites" : "Added to favorites",
      memory,
      isFavorited: !isFavorited,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE MEMORY
export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });

    // Only author can update
    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { image, description, caption, location } = req.body;

    if (image !== undefined) memory.image = image;
    if (description !== undefined) memory.description = description;
    if (caption !== undefined) memory.caption = caption;
    if (location !== undefined) memory.location = location;

    const updatedMemory = await memory.save();
    await updatedMemory.populate("author", "username email");

    res.json(updatedMemory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE MEMORY
export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });

    // Only author can delete
    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await destroyImages([memory.image]);
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE MEMORY GROUP (only the caller's own memories are deleted)
export const deleteMemoryGroup = async (req, res) => {
  try {
    const { memoryIds } = req.body;
    if (!Array.isArray(memoryIds) || memoryIds.length === 0) {
      return res.status(400).json({ message: "memoryIds must be a non-empty array" });
    }

    const memories = await Memory.find({
      _id: { $in: memoryIds },
      author: req.user._id,
    });
    if (memories.length !== memoryIds.length) {
      return res.status(403).json({ message: "Access denied" });
    }

    await destroyImages(memories.map((m) => m.image));
    await Memory.deleteMany({ _id: { $in: memories.map((m) => m._id) } });

    res.json({ message: "Memory group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
