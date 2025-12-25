import Memory from "../models/memoriesModel";
import Trip from "../models/tripModel.js";

// CREATE MEMORY
export const createMemory = async (req, res) => {
  try {
    const { tripId, image, description, location } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // Check access
    if (trip.isPrivate && !trip.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const newMemory = new Memory({
      tripId,
      image,
      description,
      location,
    });
    newMemory.author = req.user._id;
    const savedMemory = await newMemory.save();
    res.status(201).json(savedMemory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//GET ALL MEMORIES
export const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find()
      .populate("author", "name email")
      .populate("comments.user", "name email");
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
    if (trip.isPrivate && !trip.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const memories = await Memory.find({ tripId: req.params.tripId })
      .populate("author", "name email")
      .populate("comments.user", "name email");
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// LIKE MEMORY
export const likeMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    if (memory.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Memory already liked" });
    }
    memory.likes.push(req.user._id);
    await memory.save();
    res.json({ message: "Memory liked" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ADD COMMENT TO MEMORY
export const addComment = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    const { text } = req.body;
    const newComment = {
      user: req.user._id,
      text,
    };
    memory.comments.push(newComment);
    await memory.save();
    res.status(201).json({ message: "Comment added" });
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
    await memory.remove();
    res.json({ message: "Memory deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
