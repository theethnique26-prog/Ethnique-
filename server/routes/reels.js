const express = require("express");
const router = express.Router();

const Reel = require("../models/Reels.js");

// =====================================
// GET ACTIVE REELS
// =====================================
router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find({ active: { $ne: false } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reels,
    });
  } catch (error) {
    console.error("GET REELS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reels",
      error: error.message,
    });
  }
});

// =====================================
// CREATE REEL
// =====================================
router.post("/", async (req, res) => {
  try {
    const {
      title,
      videoUrl,
      thumbnail,
    } = req.body;

    if (!title || !videoUrl || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and thumbnail are required",
      });
    }

    const reel = await Reel.create({
      title,
      videoUrl,
      thumbnail,
      active: true,
    });

    res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel,
    });

  } catch (error) {
    console.error("CREATE REEL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create reel",
      error: error.message,
    });
  }
});

// =====================================
// DELETE REEL
// =====================================
router.delete("/:id", async (req, res) => {
  try {
    const reel = await Reel.findByIdAndDelete(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REEL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete reel",
      error: error.message,
    });
  }
});

module.exports = router;