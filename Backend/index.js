import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Connect MongoDB
connectDB()
  .then(() => {
    app.listen(`${process.env.PORT}||5000`, () => {
      console.log(`🚀 Server running on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log("❌ DB Error:", err));
