const express = require("express");
const router = express.Router();

const HomepageSection = require("../models/HomepageSection");
const HeritageStory = require("../models/HeritageStory");

// GET /api/homepage (Public)
router.get("/", async (req, res) => {
  try {
    let section = await HomepageSection.findOne();
    if (!section) {
      section = await HomepageSection.create({});
    }

    // If heritage story exists separately, ensure it's synced
    const story = await HeritageStory.findOne();
    if (story) {
      if (!section.heritageTitle) section.heritageTitle = story.title;
      if (!section.heritageSubtitle) section.heritageSubtitle = story.subtitle;
      if (!section.heritageStory) section.heritageStory = story.story;
      if (!section.heritagePhilosophy) section.heritagePhilosophy = story.philosophy;
      if (!section.foundingYear) section.foundingYear = story.foundingYear;
      if (!section.location) section.location = story.location;
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// POST /api/homepage (Admin update)
router.post("/", async (req, res) => {
  try {
    const section = await HomepageSection.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    // Also sync heritage if heritage fields provided
    if (req.body.heritageTitle || req.body.heritageStory) {
      await HeritageStory.findOneAndUpdate(
        {},
        {
          title: req.body.heritageTitle,
          subtitle: req.body.heritageSubtitle,
          story: req.body.heritageStory,
          philosophy: req.body.heritagePhilosophy,
          foundingYear: req.body.foundingYear,
          location: req.body.location,
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.json({
      success: true,
      section,
      message: "Homepage settings saved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// HERITAGE STORY ENDPOINTS (Legacy fallback)
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
      heritage: story,
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

    // Also sync to HomepageSection
    await HomepageSection.findOneAndUpdate(
      {},
      {
        heritageTitle: story.title,
        heritageSubtitle: story.subtitle,
        heritageStory: story.story,
        heritagePhilosophy: story.philosophy,
        foundingYear: story.foundingYear,
        location: story.location,
      },
      { upsert: true }
    );

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