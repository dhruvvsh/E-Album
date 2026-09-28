import crypto from "crypto";
import Trip from "../models/tripModel.js";
import TripInvite from "../models/tripInviteModel.js";
import sendMail from "../utils/sendMail.js";

const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const inviteParticipant = async (req, res) => {
    try {
        const { email } = req.body;
        if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
            return res.status(400).json({ message: "A valid email is required" });
        }
        const tripId = req.params.id;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
            });
        }

        // only creator can invite
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        // generate random token
        const token = crypto.randomBytes(32).toString("hex");


        // expiry 24 hrs
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await TripInvite.create({
            trip: tripId,
            invitedBy: req.user._id,
            email: email.trim(),
            token,
            expiresAt,
        });

        const inviteLink =
            `${process.env.FRONTEND_URL}/join-trip/${token}`;

        await sendMail({
            to: email,
            subject: "Trip Invitation",
            html: `
        <h2>You are invited to join trip: ${escapeHtml(trip.tripName)}</h2>

        <a href="${inviteLink}">
          Join Trip
        </a>

        <p>Link expires in 24 hours</p>
      `,
        });

        res.status(200).json({
            message: "Invitation sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};