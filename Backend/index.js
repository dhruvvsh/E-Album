import express from "express";
import cors from "cors";
import dotenv from "dotenv";
console.log('Current directory:', process.cwd());
console.log('Looking for .env at:', process.cwd() + '/.env');
dotenv.config();
import connectDB from "./config/db.js";
import userrouter from "./routes/userRoutes.js";
import triprouter from "./routes/tripRoutes.js";
import memoryrouter from "./routes/memoryRoutes.js";
import { cloudinaryConfig } from './utils/cloudinary.js';
cloudinaryConfig();
// import cloudinarySignaturerouter from "./routes/cloudinaryRoutes.js";

// Load environment variables


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/users", userrouter);
app.use("/trips", triprouter);
app.use("/memories", memoryrouter);
// app.use("/cloudinary", cloudinarySignaturerouter);

// Connect MongoDB
connectDB()
  .then(() => {
    app.listen(`${process.env.PORT}` || 5001, () => {
      console.log(`🚀 Server running on port: ${process.env.PORT || 5001}`);
    });
  })
  .catch((err) => console.log("❌ DB Error:", err));
