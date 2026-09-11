const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/Adminauth");

// Initial Glam Clan coupons seed dataset
const SEED_COUPONS = [
  {
    code: "JAYANT10",
    title: "Storewide Festive Celebration",
    description: "Flat 10% OFF on all designer drapes and signature sarees.",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 1999,
    maxDiscount: 1000,
    requiredTier: "all",
    badge: "Store Favorite",
    popular: true,
    isActive: true,
  },
  {
    code: "GLAMCLAN15",
    title: "Member Exclusive Drape Voucher",
    description: "15% OFF up to ₹750 on your entire curated cart.",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 3499,
    maxDiscount: 750,
    requiredTier: "all",
    badge: "Glam Clan Exclusive",
    popular: true,
    isActive: true,
  },
  {
    code: "ROYAL20",
    title: "Haute Couture & Bridal Trousseau",
    description: "Flat 20% OFF on festive & bridal drapes above ₹4,999.",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 4999,
    maxDiscount: 2500,
    requiredTier: "all",
    badge: "VIP Bridal & Festive",
    popular: false,
    isActive: true,
  },
  {
    code: "FREESHIP",
    title: "Insured Express Priority Delivery",
    description: "100% Free insured express shipping on orders above ₹999.",
    discountType: "shipping",
    discountValue: 100,
    minOrderAmount: 999,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Free Delivery",
    popular: false,
    isActive: true,
  },
  {
    code: "FIRSTGLAM",
    title: "New Member Welcome Gift",
    description: "Flat ₹200 OFF on your first purchase with Ethnique.",
    discountType: "flat",
    discountValue: 200,
    minOrderAmount: 1499,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Welcome Gift",
    popular: false,
    isActive: true,
  },
  {
    code: "ELITE5",
    title: "Clan Elite & Ultimate Instant Perks",
    description: "Extra 5% instant discount exclusively for Elite & Ultimate members.",
    discountType: "percentage",
    discountValue: 5,
    minOrderAmount: 1999,
    maxDiscount: 500,
    requiredTier: "elite",
    badge: "Elite Members",
    popular: false,
    isActive: true,
  },
  {
    code: "FESTIVE500",
    title: "Seasonal Drop Bonanza",
    description: "Flat ₹500 OFF on festive purchases above ₹3,999.",
    discountType: "flat",
    discountValue: 500,
    minOrderAmount: 3999,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Limited Drop",
    popular: false,
    isActive: true,
  },
  {
    code: "BDAY350",
    title: "Birthday Month Celebration",
    description: "A special ₹350 voucher for your celebration month.",
    discountType: "flat",
    discountValue: 350,
    minOrderAmount: 2499,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Special Perk",
    popular: false,
    isActive: true,
  },
  {
    code: "ETHNIC100",
    title: "Everyday Pure Cotton & Silk",
    description: "Flat ₹100 OFF on everyday office & casual designer drapes.",
    discountType: "flat",
    discountValue: 100,
    minOrderAmount: 999,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Quick Saver",
    popular: false,
    isActive: true,
  },
  {
    code: "ETHNIQUE2498",
    title: "Grand Royal Celebration ₹2,498 Voucher",
    description: "Flat ₹2,498 instant discount on designer bridal and festive drapes above ₹4,999.",
    discountType: "flat",
    discountValue: 2498,
    minOrderAmount: 4999,
    maxDiscount: null,
    requiredTier: "all",
    badge: "Special ₹2,498 OFF",
    popular: true,
    isActive: true,
  },
];

// Helper to seed initial coupons if none exist
const ensureCouponsSeeded = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(SEED_COUPONS);
      console.log("Coupons successfully initialized in database.");
    } else {
      const has2498 = await Coupon.findOne({ code: "ETHNIQUE2498" });
      if (!has2498) {
        await Coupon.create({
          code: "ETHNIQUE2498",
          title: "Grand Royal Celebration ₹2,498 Voucher",
          description: "Flat ₹2,498 instant discount on designer bridal and festive drapes above ₹4,999.",
          discountType: "flat",
          discountValue: 2498,
          minOrderAmount: 4999,
          maxDiscount: null,
          requiredTier: "all",
          badge: "Special ₹2,498 OFF",
          popular: true,
          isActive: true,
        });
        console.log("ETHNIQUE2498 coupon created in database.");
      }
    }
  } catch (err) {
    console.error("Coupon seed check error:", err.message);
  }
};

// Ensure seed check is triggered
ensureCouponsSeeded();

// Helper to parse optional user token without blocking unauthenticated requests
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return null;
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
};

// =====================================
// 1. GET ALL ACTIVE COUPONS (PUBLIC)
// =====================================
router.get("/", async (req, res) => {
  try {
    await ensureCouponsSeeded();
    const coupons = await Coupon.find({ isActive: true }).sort({ popular: -1, createdAt: -1 });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
});

// =====================================
// 1B. GET ALL COUPONS (ADMIN)
// =====================================
router.get("/admin", adminAuth, async (req, res) => {
  try {
    await ensureCouponsSeeded();
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("GET ADMIN COUPONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin coupons",
    });
  }
});

// =====================================
// 2. VALIDATE COUPON AT CHECKOUT
// =====================================
router.post("/validate", async (req, res) => {
  try {
    await ensureCouponsSeeded();
    const { code, subtotal = 0 } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Please provide a valid coupon code",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `Coupon code '${cleanCode}' is invalid or expired.`,
      });
    }

    // Check expiry if set
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon '${cleanCode}' has expired.`,
      });
    }

    // Check minimum order amount
    const orderAmount = Number(subtotal) || 0;
    if (orderAmount < coupon.minOrderAmount) {
      const needed = coupon.minOrderAmount - orderAmount;
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order of ₹${coupon.minOrderAmount.toLocaleString("en-IN")} required for '${cleanCode}'. Add ₹${needed.toLocaleString("en-IN")} more to apply.`,
      });
    }

    // Optional user tier validation
    const user = await getOptionalUser(req);
    const userPoints = user?.loyaltyPoints || 0;

    if (coupon.requiredTier === "elite" && userPoints < 500) {
      return res.status(403).json({
        success: false,
        valid: false,
        message: `Coupon '${cleanCode}' is an exclusive perk reserved for Clan Elite (500+ pts) members.`,
      });
    }

    if (coupon.requiredTier === "ultimate" && userPoints < 1500) {
      return res.status(403).json({
        success: false,
        valid: false,
        message: `Coupon '${cleanCode}' is exclusively reserved for Ultimate Glam Clan (1,500+ pts) members.`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    let freeShipping = false;

    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "flat") {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    } else if (coupon.discountType === "shipping") {
      freeShipping = true;
      discountAmount = 0;
    }

    discountAmount = Math.round(discountAmount);

    return res.status(200).json({
      success: true,
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        freeShipping,
        minOrderAmount: coupon.minOrderAmount,
        badge: coupon.badge,
        message: freeShipping
          ? `Coupon '${coupon.code}' applied! You unlocked 100% Free Express Shipping.`
          : `Coupon '${coupon.code}' applied! You saved ₹${discountAmount.toLocaleString("en-IN")}.`,
      },
    });
  } catch (error) {
    console.error("VALIDATE COUPON ERROR:", error);
    res.status(500).json({
      success: false,
      valid: false,
      message: error.message || "Failed to validate coupon",
    });
  }
});

// =====================================
// 3. ADMIN: CREATE COUPON
// =====================================
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      requiredTier,
      badge,
      popular,
      expiryDate,
    } = req.body;

    if (!code || !title || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "Code, title, discountType, and discountValue are required",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon with code '${cleanCode}' already exists`,
      });
    }

    const coupon = new Coupon({
      code: cleanCode,
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      requiredTier: requiredTier || "all",
      badge: badge || "Special Offer",
      popular: Boolean(popular),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
});

// =====================================
// 4. ADMIN: TOGGLE COUPON STATUS
// =====================================
router.patch("/:id/toggle", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================
// 5. ADMIN: DELETE COUPON
// =====================================
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
