const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const adminAuth = require("../middleware/Adminauth");

// Initial Seed Reviews
const SEED_REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Bangalore",
    occasion: "Festive Drape",
    short: "Soft and breathable all day long.",
    full: "The cotton is incredibly soft and breathable. It feels light in tropical weather and still looks regal even after long hours.",
    rating: 5,
    featured: true,
    isActive: true,
  },
  {
    name: "Ananya Deshmukh",
    location: "Mumbai",
    occasion: "Daily Festive",
    short: "Minimal, classy & comfortable.",
    full: "Minimal, classy, and perfect for everyday elegance. I’ve already ordered another saree because the fabric quality is unmatched.",
    rating: 5,
    featured: true,
    isActive: true,
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    occasion: "Temple Celebration",
    short: "Craftsmanship in every thread.",
    full: "You can really feel the exquisite craftsmanship in every thread. The saree drapes like a dream and earned me countless compliments.",
    rating: 5,
    featured: true,
    isActive: true,
  },
  {
    name: "Radhika Sen",
    location: "Kolkata",
    occasion: "Festive Connoisseur",
    short: "Authentic Jayant Saree Center quality.",
    full: "Finding genuine pure cotton with rich borders online used to be rare. Ethnique by Jayant Saree Center has become my trusted boutique for authentic drapes.",
    rating: 5,
    featured: true,
    isActive: true,
  },
];

const ensureReviewsSeeded = async () => {
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      await Review.insertMany(SEED_REVIEWS);
      console.log("Default Customer Reviews seeded successfully.");
    }
  } catch (err) {
    console.error("Review seed error:", err.message);
  }
};

ensureReviewsSeeded();

// =====================================
// 1. GET ALL REVIEWS (Public)
// =====================================
router.get("/", async (req, res) => {
  try {
    await ensureReviewsSeeded();
    const reviews = await Review.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
});

// =====================================
// 2. GET ALL REVIEWS (Admin - includes inactive)
// =====================================
router.get("/admin", adminAuth, async (req, res) => {
  try {
    await ensureReviewsSeeded();
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("ADMIN GET REVIEWS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin reviews" });
  }
});

// =====================================
// 3. CREATE REVIEW (Admin or Patron)
// =====================================
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, location, occasion, short, full, rating } = req.body;

    if (!name || !short || !full) {
      return res.status(400).json({
        success: false,
        message: "Customer name, highlight, and full review are required",
      });
    }

    const review = new Review({
      name: name.trim(),
      location: location ? location.trim() : "India",
      occasion: occasion ? occasion.trim() : "Festive Drape",
      short: short.trim(),
      full: full.trim(),
      rating: Number(rating) || 5,
      featured: true,
      isActive: true,
    });

    await review.save();

    res.status(201).json({
      success: true,
      review,
      message: "Customer review published successfully",
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================
// 4. TOGGLE REVIEW ACTIVE STATUS (Admin)
// =====================================
router.patch("/:id/toggle", adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.isActive = !review.isActive;
    await review.save();

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================================
// 5. DELETE REVIEW (Admin)
// =====================================
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      message: "Customer review removed successfully",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
