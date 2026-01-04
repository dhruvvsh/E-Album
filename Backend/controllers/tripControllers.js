import Trip from "../models/tripModel.js";
import Memory from "../models/memoriesModel.js";

// CREATE TRIP
export const createTrip = async (req, res) => {
  try {
    const { tripName, description, coverPhoto, startDate, endDate, isPrivate } =
      req.body;
    const newTrip = new Trip({
      tripName,
      description,
      coverPhoto,
      startDate,
      endDate,
      isPrivate,
      createdBy: req.user._id,
      participants: [req.user._id],
    });
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// GET ALL TRIPS
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ isPrivate: false }, { participants: req.user._id }],
    })
      .populate("createdBy", "name email")
      .populate("participants", "name email");
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// GET TRIP BY ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // Check access
    if (trip.isPrivate && !trip.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// UPDATE TRIP
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // Only creator can update
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { tripName, description, coverPhoto, startDate, endDate, isPrivate } =
      req.body;
    trip.tripName = tripName || trip.tripName;
    trip.description = description || trip.description;
    trip.coverPhoto = coverPhoto || trip.coverPhoto;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.isPrivate = isPrivate !== undefined ? isPrivate : trip.isPrivate;
    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// DELETE TRIP
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // Only creator can delete
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    await Memory.deleteMany({ trip: trip._id });
    await trip.remove();
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
