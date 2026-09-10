const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware =
  require("../middleware/authMiddleware");

router.put(
  "/update",
  authMiddleware,
  async (req, res) => {
    try {
      const { name, phone } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (phone !== undefined) updateData.phone = phone.trim();

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          updateData,
          { new: true }
        ).select("-password");

      res.json(user);

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post(
  "/address",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user._id
      );

      user.addresses.push(req.body);

      await user.save();

      res.json(user.addresses);

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.get(
  "/addresses",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      res.json(user.addresses);

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;