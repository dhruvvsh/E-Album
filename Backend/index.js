import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ DB Error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
