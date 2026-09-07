const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to get razorpay instance safely
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// =====================================
// 1. CREATE RAZORPAY ORDER
// =====================================
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount provided",
      });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay API keys are not configured in server .env (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)",
      });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // convert INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      keyId: key_id,
    });
  } catch (error) {
    console.error("RAZORPAY CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
});

// =====================================
// 2. VERIFY PAYMENT & CREATE ORDER
// =====================================
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      subtotal,
      shippingCharge = 0,
      discount = 0,
      totalAmount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({
        success: false,
        message: "RAZORPAY_KEY_SECRET is not configured on server",
      });
    }

    // Verify signature with HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: invalid signature",
      });
    }

    // Create and save the order in MongoDB
    const order = new Order({
      customer: req.user._id,
      items,
      shippingAddress,
      subtotal: subtotal || totalAmount,
      shippingCharge,
      discount,
      totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      notes: `Razorpay Payment ID: ${razorpay_payment_id}`,
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name images priceINR");

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
});

// =====================================
// 3. CASH ON DELIVERY (COD) ORDER
// =====================================
router.post("/cod-order", authMiddleware, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      shippingCharge = 0,
      discount = 0,
      totalAmount,
    } = req.body;

    const order = new Order({
      customer: req.user._id,
      items,
      shippingAddress,
      subtotal: subtotal || totalAmount,
      shippingCharge,
      discount,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      notes: "Cash on Delivery",
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name images priceINR");

    res.status(201).json({
      success: true,
      message: "Order placed successfully with Cash on Delivery",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("COD ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place COD order",
    });
  }
});

module.exports = router;
