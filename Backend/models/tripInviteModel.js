import mongoose from "mongoose";

const tripInviteSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// remove expired invites automatically
tripInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TripInvite = mongoose.model("TripInvite", tripInviteSchema);

export default TripInvite;