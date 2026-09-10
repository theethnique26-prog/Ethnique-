const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      unique: true,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: [
        "Virtual Video Drape",
        "In-Store Private Styling",
        "Bridal Trousseau Curation",
        "Custom Blouse & Fall-Pico Consultation",
      ],
      default: "Virtual Video Drape",
    },
    consultationFocus: {
      type: String,
      default: "General Saree Styling",
    },
    date: {
      type: String, // e.g. "2026-09-12"
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "11:00 AM"
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Completed", "Cancelled"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema, "appointments");
