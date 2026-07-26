const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema(
  {
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,

    collectionTitle: String,
    collectionSubtitle: String,
    collectionImage: String,

    featuredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    newArrivals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    bestSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Homepage",
  homepageSchema
);