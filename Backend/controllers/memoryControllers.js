import Memory from "../models/memoriesModel.js";
import Trip from "../models/tripModel.js";

// CREATE MEMORY
export const createMemory = async (req, res) => {
  try {
    const { tripId, image, description, caption, location } = req.body;
    const author = req.user._id;

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
      caption: caption || description, // If no caption provided, use description
      location,
      author,
      isFavorite: [],
    });

    const savedMemory = await newMemory.save();
    await savedMemory.populate("author", "name email ");

    res.status(201).json(savedMemory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL MEMORIES
export const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find()
      .populate("author", "name email")
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
    if (trip.isPrivate && !trip.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const memories = await Memory.find({ tripId: req.params.tripId })
      .populate("author", "name email")
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

    const userId = req.user._id;
    const isFavorited = memory.isFavorite.includes(userId);

    if (isFavorited) {
      // Remove from favorites
      memory.isFavorite = memory.isFavorite.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add to favorites
      memory.isFavorite.push(userId);
    }

    await memory.save();
    await memory.populate("author", "name email");

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

    if (image) memory.image = image;
    if (description) memory.description = description;
    if (caption) memory.caption = caption;
    if (location) memory.location = location;

    const updatedMemory = await memory.save();
    await updatedMemory.populate("author", "name email");

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

    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
