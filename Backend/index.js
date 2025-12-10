import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userrouter from "./routes/userRoutes.js";
import triprouter from "./routes/tripRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/users", userrouter);
app.use("/trips", triprouter);

// Connect MongoDB
connectDB()
  .then(() => {
    app.listen(`${process.env.PORT}` || 5001, () => {
      console.log(`🚀 Server running on port: ${process.env.PORT || 5001}`);
    });
  })
  .catch((err) => console.log("❌ DB Error:", err));
