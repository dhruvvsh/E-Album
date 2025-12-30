import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCloudinarySignature } from "../controllers/cloudinaryControllers.js";

const cloudinarySignaturerouter = express.Router();

cloudinarySignaturerouter.get("/signature", protect, getCloudinarySignature);

export default cloudinarySignaturerouter;
