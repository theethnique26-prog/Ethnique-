const mongoose = require("mongoose");

const heritageStorySchema = new mongoose.Schema(
  {
    heroTagline: {
      type: String,
      default: "From The House of Jayant Saree Center",
    },
    title: {
      type: String,
      default: "Our Heritage & Story",
    },
    subtitle: {
      type: String,
      default:
        "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration.",
    },
    retailRootsHeading: {
      type: String,
      default: "The Jayant Saree Center Legacy",
    },
    paragraph1: {
      type: String,
      default:
        "Founded as Jayant Saree Center, our journey began with a simple yet enduring promise: to offer women the most exquisite ethnic wear, bridal drapes, and festive sarees under one roof with uncompromised quality and heartfelt personal service.",
    },
    paragraph2: {
      type: String,
      default:
        "Over the years, our brick-and-mortar boutique earned the trust of thousands of families for weddings, festivals, and milestone occasions. To take this legacy forward into the modern era, we created Ethnique By Jayant — our contemporary digital destination delivering our finest curated sarees across India.",
    },
    quoteText: {
      type: String,
      default:
        '"Draping generations in grace — bringing the signature Jayant Saree Center collection to your doorstep."',
    },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
    },
    stat1Number: { type: String, default: "10,000+" },
    stat1Label: { type: String, default: "Happy Patrons" },
    stat2Number: { type: String, default: "100%" },
    stat2Label: { type: String, default: "Pure Quality Fabrics" },
    stat3Number: { type: String, default: "25+ Yrs" },
    stat3Label: { type: String, default: "Retail Heritage" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeritageStory", heritageStorySchema);
