const express = require("express");
const router = express.Router();

const HomepageSection = require("../models/HomepageSection");
const HeritageStory = require("../models/HeritageStory");

router.get("/", async (req, res) => {
  try {
    const section = await HomepageSection.findOne({
      active: true,
    });

    res.json(section);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const section = await HomepageSection.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });

    res.json(section);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================
// HERITAGE STORY ENDPOINTS
// =====================================
router.get("/heritage", async (req, res) => {
  try {
    let story = await HeritageStory.findOne();
    if (!story) {
      story = await HeritageStory.create({});
    }
    res.json({
      success: true,
      story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/heritage", async (req, res) => {
  try {
    const story = await HeritageStory.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.json({
      success: true,
      story,
      message: "Heritage story saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;