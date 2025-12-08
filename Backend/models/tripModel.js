import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
