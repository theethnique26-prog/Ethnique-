const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to determine tier details
const getTierDetails = (points = 0) => {
  if (points >= 1500) {
    return {
      tierId: "ultimate",
      name: "Ultimate Glam Club",
      subtitle: "Level 3 • Top Tier VIP",
      badge: "VIP Monarch",
      minPts: 1500,
      nextTier: null,
      pointsNeeded: 0,
      progressPercent: 100,
      earnRate: "2.0x Club Points on every purchase",
      freeShippingAlways: true,
      perks: [
        "Free Delivery on all orders (no minimum purchase)",
        "Bespoke Blouse Finishing & Stylist Concierge",
        "Direct WhatsApp Priority Access",
        "Earn 2x Club Points on all designer drapes",
      ],
    };
  }

  if (points >= 500) {
    return {
      tierId: "elite",
      name: "Club Elite",
      subtitle: "Level 2 • 500+ Points",
      badge: "Most Popular",
      minPts: 500,
      nextTier: "Ultimate Glam Club",
      pointsNeeded: 1500 - points,
      progressPercent: Math.min(Math.round(((points - 500) / 1000) * 100), 100),
      earnRate: "1.5x Club Points on every purchase",
      freeShippingAlways: true,
      perks: [
        "Free Delivery on ALL orders (zero minimum purchase)",
        "Extra 5% Instant Discount code ELITE5 on checkout",
        "12-Hour Early Access to big seasonal sale drops",
        "Earn 1.5x Club Points on all purchases",
      ],
    };
  }

  return {
    tierId: "insider",
    name: "Club Insider",
    subtitle: "Level 1 • Auto Unlocked",
    badge: "Entry Tier",
    minPts: 0,
    nextTier: "Club Elite",
    pointsNeeded: 500 - points,
    progressPercent: Math.min(Math.round((points / 500) * 100), 100),
    earnRate: "1.0x Club Point per ₹10 spent",
    freeShippingAlways: false,
    perks: [
      "Standard delivery on orders above ₹999",
      "Welcome voucher code FIRSTGLAM (₹200 OFF)",
      "Earn 1 Club Point on every ₹10 spent",
    ],
  };
};

// =====================================
// 1. GET LOYALTY STATUS & CLUB PROGRESS
// =====================================
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email loyaltyPoints lastBonusClaimDate createdAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentPoints = user.loyaltyPoints || 0;
    const tier = getTierDetails(currentPoints);

    // Check if daily bonus can be claimed (24-hour cooldown)
    let canClaimBonus = true;
    let nextClaimInHours = 0;

    if (user.lastBonusClaimDate) {
      const now = new Date();
      const lastClaim = new Date(user.lastBonusClaimDate);
      const diffMs = now - lastClaim;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (diffMs < twentyFourHours) {
        canClaimBonus = false;
        nextClaimInHours = Math.ceil((twentyFourHours - diffMs) / (1000 * 60 * 60));
      }
    }

    // Get order history point contributions
    const userOrders = await Order.find({ customer: user._id }).select(
      "totalAmount pointsEarned pointsRedeemed createdAt orderStatus"
    );

    res.json({
      success: true,
      loyalty: {
        points: currentPoints,
        tier,
        canClaimBonus,
        nextClaimInHours,
        ordersCount: userOrders.length,
        pointsRedemptionRate: "1 Club Point = ₹5 off at checkout (max 50% cart total)",
      },
    });
  } catch (error) {
    console.error("GET LOYALTY STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================
// 2. CLAIM BONUS CLUB POINTS (+50 PTS)
// =====================================
router.post("/claim-bonus", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (user.lastBonusClaimDate) {
      const lastClaim = new Date(user.lastBonusClaimDate);
      const diffMs = now - lastClaim;

      if (diffMs < twentyFourHours) {
        const remainingHours = Math.ceil((twentyFourHours - diffMs) / (1000 * 60 * 60));
        return res.status(400).json({
          success: false,
          message: `Bonus points already claimed today! Please return in ${remainingHours} hour(s).`,
        });
      }
    }

    const BONUS_POINTS = 50;
    user.loyaltyPoints = (user.loyaltyPoints || 0) + BONUS_POINTS;
    user.lastBonusClaimDate = now;
    await user.save();

    const tier = getTierDetails(user.loyaltyPoints);

    res.json({
      success: true,
      message: `✨ Congratulations! +${BONUS_POINTS} Club Points added to your VIP Pass!`,
      points: user.loyaltyPoints,
      tier,
    });
  } catch (error) {
    console.error("CLAIM BONUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================
// 3. CALCULATE POINTS REDEMPTION DISCOUNT (1 Point = ₹5)
// =====================================
router.post("/redeem-preview", authMiddleware, async (req, res) => {
  try {
    const { pointsToRedeem = 0, subtotal = 0 } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const requestedPoints = Math.max(0, Math.floor(Number(pointsToRedeem) || 0));
    const userAvailablePoints = user.loyaltyPoints || 0;

    if (requestedPoints <= 0) {
      return res.json({
        success: true,
        pointsRedeemed: 0,
        discountAmount: 0,
      });
    }

    if (requestedPoints > userAvailablePoints) {
      return res.status(400).json({
        success: false,
        message: `You only have ${userAvailablePoints} Club Points available.`,
      });
    }

    // 1 point = ₹5 discount
    const rawDiscount = requestedPoints * 5;
    // Cap at 50% of subtotal
    const maxAllowedDiscount = Math.floor((Number(subtotal) || 0) * 0.5);
    const finalDiscount = Math.min(rawDiscount, maxAllowedDiscount);
    const actualPointsUsed = Math.ceil(finalDiscount / 5);

    res.json({
      success: true,
      pointsRedeemed: actualPointsUsed,
      discountAmount: Math.round(finalDiscount),
      remainingPoints: userAvailablePoints - actualPointsUsed,
    });
  } catch (error) {
    console.error("REDEEM PREVIEW ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
