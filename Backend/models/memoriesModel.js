import mongoose from "mongoose";

const memoriesSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      // For MemoryGroupCard display (trip overview)
    },
    caption: {
      type: String,
      default: "",
      // Story/narrative for each memory in carousel
      // Example: "Golden hour at the beach", "First snow of the season"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    location: {
      type: String,
    },
    isFavorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

const Memory = mongoose.model("Memory", memoriesSchema);

export default Memory;
