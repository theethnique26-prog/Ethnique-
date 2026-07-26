const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const adminAuth = require("../middleware/Adminauth");

// ====================================
// GET ALL CUSTOMERS
// ====================================

router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).sort({ createdAt: -1 });

    const customers = await Promise.all(
  users.map(async (user) => {

    const orders = await Order.find({
      customer: user._id,
    });

    const orderCount = orders.length;

    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      loyaltyPoints: user.loyaltyPoints,
      createdAt: user.createdAt,
      addresses: user.addresses,
      orderCount,
      totalSpent,
    };
  })
);

    res.json({
      success: true,
      customers,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ====================================
// GET SINGLE CUSTOMER
// ====================================

router.get("/:id", adminAuth, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const orders = await Order.find({
      customer: customer._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      customer,
      orders,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;