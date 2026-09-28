import Trip from "../models/tripModel.js";
import Memory from "../models/memoriesModel.js";
import { destroyImages } from "../utils/cloudinary.js";
import TripInvite from "../models/tripInviteModel.js";
import { isParticipant } from "../utils/tripAccess.js";
// CREATE TRIP
export const createTrip = async (req, res) => {
  try {
    const { tripName, description, coverPhoto, startDate, endDate, isPrivate } =
      req.body;
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }
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
    const tripWithUser = await Trip.findById(savedTrip._id)
      .populate("createdBy", "username email")
      .populate("participants", "username email");
    res.status(201).json(tripWithUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// GET ALL TRIPS
export const getTrips = async (req, res) => {
  try {
    // every trip the user belongs to, private ones included (UI shows a lock badge)
    const trips = await Trip.find({ participants: req.user._id })
      .populate("createdBy", "username email")
      .populate("participants", "username email");
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// GET TRIP BY ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("participants", "username email");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // Check access
    if (trip.isPrivate && !isParticipant(trip, req.user._id)) {
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
    trip.tripName = tripName ?? trip.tripName;
    trip.description = description ?? trip.description;
    trip.coverPhoto = coverPhoto ?? trip.coverPhoto;
    trip.startDate = startDate ?? trip.startDate;
    trip.endDate = endDate ?? trip.endDate;
    trip.isPrivate = isPrivate ?? trip.isPrivate;
    if (trip.endDate < trip.startDate) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }
    await trip.save();
    const updatedTrip = await Trip.findById(trip._id)
      .populate("createdBy", "username email")
      .populate("participants", "username email");
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
    const memories = await Memory.find({ tripId: trip._id });
    await destroyImages([trip.coverPhoto, ...memories.map((m) => m.image)]);
    await Memory.deleteMany({ tripId: trip._id });
    await TripInvite.deleteMany({ trip: trip._id });
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

};

export const joinTrip = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await TripInvite.findOne({ token });

    if (!invite) {
      return res.status(400).json({
        message: "Invalid invite",
      });
    }

    if (invite.isUsed) {
      return res.status(400).json({
        message: "Invite already used",
      });
    }

    // check expiry
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invite expired",
      });
    }

    // if (invite.email !== req.user.email) {
    //   return res.status(403).json({
    //     message: "This invitation belongs to another email",
    //   });
    // }

    const trip = await Trip.findById(invite.trip);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // prevent duplicate participant
    const alreadyParticipant = trip.participants.some(
      (participantId) =>
        participantId.toString() === req.user._id.toString()
    );

    if (alreadyParticipant) {
      return res.status(400).json({
        message: "You are already a participant in this trip",
      });
    }

    // claim the invite atomically so two requests cannot both use it
    const claimed = await TripInvite.findOneAndUpdate(
      { _id: invite._id, isUsed: false },
      { isUsed: true }
    );
    if (!claimed) {
      return res.status(400).json({ message: "Invite already used" });
    }

    await Trip.updateOne(
      { _id: trip._id },
      { $addToSet: { participants: req.user._id } }
    );

    const joinedTrip = await Trip.findById(trip._id)
      .populate("createdBy", "username email")
      .populate("participants", "username email");

    res.status(200).json({
      message: "Joined trip successfully",
      trip: joinedTrip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
