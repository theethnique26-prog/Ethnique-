const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subtitle: String,

    imageUrl: {
      type: String,
      required: true,
    },

    buttonText: String,

    buttonLink: String,

    position: {
      type: String,
      enum: ["Top", "Middle", "Bottom"],
      default: "Top",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);