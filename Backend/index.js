import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userrouter from "./routes/userRoutes.js";
import triprouter from "./routes/tripRoutes.js";
import memoryrouter from "./routes/memoryRoutes.js";
import cloudinarySignaturerouter from "./routes/cloudinaryRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/users", userrouter);
app.use("/trips", triprouter);
app.use("/memories", memoryrouter);
app.use("/cloudinary", cloudinarySignaturerouter);

// Connect MongoDB
connectDB()
  .then(() => {
    app.listen(`${process.env.PORT}` || 5001, () => {
      console.log(`🚀 Server running on port: ${process.env.PORT || 5001}`);
    });
  })
  .catch((err) => console.log("❌ DB Error:", err));
