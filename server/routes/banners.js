const express = require("express");
const router = express.Router();

const Banner = require("../models/Banner");

// ===============================
// GET ALL BANNERS
// ===============================
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({
      createdAt: -1,
    });

    res.json(banners);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===============================
// CREATE BANNER
// ===============================
router.post("/", async (req, res) => {
  try {
    const banner = await Banner.create(req.body);

    res.json(banner);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===============================
// UPDATE BANNER
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(banner);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===============================
// DELETE BANNER
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      message: "Banner deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;