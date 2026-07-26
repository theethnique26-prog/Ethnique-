const express = require("express");
const router = express.Router();

const User = require("../models/User");
const adminAuth = require("../middleware/Adminauth");

// GET ALL CUSTOMERS
router.get("/", adminAuth, async (req, res) => {
  try {
    const customers = await User.find({
      role: "user",
    }).select("-password");

    res.json({
      success: true,
      customers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET SINGLE CUSTOMER
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const customer = await User.findById(
      req.params.id
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE CUSTOMER
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Customer deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;