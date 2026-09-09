const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
    },
    video: {
  type: String,
  default: "",
},

    description: String,

    highlight: String,

    fabric: String,

    color: String,

    sareeLength: String,

    blouse: String,

    priceINR: {
      type: Number,
      required: true,
    },

    priceUSD: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    images: [
      {
        type: String,
      },
    ],

    collection: String,

    category: {
      type: String,
      default: "Cotton Saree",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);