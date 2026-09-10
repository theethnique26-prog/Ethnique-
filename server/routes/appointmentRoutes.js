const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const adminAuth = require("../middleware/Adminauth");
const {
  sendAppointmentNotification,
  buildGoogleCalendarUrl,
} = require("../utils/emailService");

// Helper to generate unique booking reference
const generateBookingRef = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `APT-${randomNum}`;
};

// 1. PUBLIC: Book a Video Drape or In-Store Consultation
router.post("/book", async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      sessionType,
      consultationFocus,
      date,
      timeSlot,
      notes,
    } = req.body;

    if (!clientName || !clientPhone || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, preferred date, and time slot are required.",
      });
    }

    const bookingRef = generateBookingRef();

    const appointment = await Appointment.create({
      bookingRef,
      clientName: clientName.trim(),
      clientEmail: (clientEmail || "client@ethnique.concierge").trim(),
      clientPhone: clientPhone.trim(),
      sessionType: sessionType || "Virtual Video Drape",
      consultationFocus: consultationFocus || "General Saree Styling",
      date,
      timeSlot,
      notes: (notes || "").trim(),
      status: "Confirmed",
    });

    console.log(
      `[APPOINTMENT BOOKED] Ref: ${bookingRef} | Client: ${appointment.clientName} | Type: ${appointment.sessionType} | Slot: ${date} @ ${timeSlot}`
    );

    const googleCalendarUrl = buildGoogleCalendarUrl(appointment);

    // Send email notification to Admin with .ics invite and calendar block link
    sendAppointmentNotification(appointment).catch((err) => {
      console.error("[EMAIL NOTIFICATION FAILED]:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Your luxury consultation has been reserved successfully!",
      appointment,
      googleCalendarUrl,
    });
  } catch (err) {
    console.error("APPOINTMENT BOOKING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to book appointment",
    });
  }
});

// 2. ADMIN: Get all appointments (with optional date or status filter)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.sessionType = type;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    console.error("GET APPOINTMENTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch appointments",
    });
  }
});

// 3. ADMIN: Update appointment status (e.g. Completed, Rescheduled, Cancelled)
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("UPDATE APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update appointment",
    });
  }
});

// 4. ADMIN: Delete appointment
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment removed successfully",
    });
  } catch (err) {
    console.error("DELETE APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete appointment",
    });
  }
});

module.exports = router;
