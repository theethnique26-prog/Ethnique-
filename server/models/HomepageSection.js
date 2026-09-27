const mongoose = require("mongoose");

const homepageSectionSchema = new mongoose.Schema(
  {
    // 1. Top Banner & Main Headline
    heroSealBadge: {
      type: String,
      default: "✦ By Jayant Saree Center • Curated Ethnic Wear ✦",
    },
    heroTitle: {
      type: String,
      default: "A Symphony of Heritage & Grace",
    },
    heroHighlightWord: {
      type: String,
      default: "Heritage",
    },
    heroSubtitle: {
      type: String,
      default:
        "Curated designer sarees, festive silks, and elegant cotton drapes from the trusted house of Jayant Saree Center.",
    },
    primaryButtonText: {
      type: String,
      default: "Explore Collection",
    },
    primaryButtonLink: {
      type: String,
      default: "/products",
    },
    secondaryButtonText: {
      type: String,
      default: "Watch Draping Reels",
    },
    secondaryButtonLink: {
      type: String,
      default: "/reels",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },

    // 2. Three Jharokha (Palace Archway) Showcases
    archway1: {
      badge: { type: String, default: "👑 Banarasi Saree" },
      title: { type: String, default: "Pure Zari Weave • Heritage Red" },
      link: { type: String, default: "/products?search=banarasi" },
      image1: { type: String, default: "" },
      image2: { type: String, default: "" },
    },
    archway2: {
      badge: { type: String, default: "✨ The Atelier Signature" },
      tagline: { type: String, default: "Exclusive Saree Edit" },
      title: { type: String, default: "Curated Chanderi & Festive Silk" },
      link: { type: String, default: "/products?search=chanderi" },
      image1: { type: String, default: "" },
      image2: { type: String, default: "" },
    },
    archway3: {
      badge: { type: String, default: "Mulmul Cotton" },
      title: { type: String, default: "Breathable Weave • Emerald Drape" },
      link: { type: String, default: "/products?search=mulmul" },
      image1: { type: String, default: "" },
      image2: { type: String, default: "" },
    },

    // 3. Trust & Statistics Bar
    stat1Value: { type: String, default: "1 Lakh+" },
    stat1Label: { type: String, default: "Patrons Draped Worldwide" },
    stat2Value: { type: String, default: "100% Inspected" },
    stat2Label: { type: String, default: "Curated Designer Sarees" },
    stat3Value: { type: String, default: "Jayant Saree Center" },
    stat3Label: { type: String, default: "Retail Trust & Heritage" },
    stat4Value: { type: String, default: "Complimentary" },
    stat4Label: { type: String, default: "Pan-India Express Shipping" },

    // 4. Curated Saree Catalog Section
    sareesSectionBadge: { type: String, default: "Curated Atelier" },
    sareesSectionTitle: { type: String, default: "New Arrivals" },
    sareesSectionSubtitle: {
      type: String,
      default:
        "Handpicked elegance crafted for everyday comfort and sacred celebratory moments.",
    },
    viewAllButtonText: { type: String, default: "View Full Gallery" },

    // 5. Customer Testimonials & Reviews Banner
    reviewsSectionBadge: { type: String, default: "Voices of Patrons" },
    reviewsSectionTitle: { type: String, default: "What Our Customers Say" },
    reviewsSectionSubtitle: {
      type: String,
      default:
        "Cherished memories styled into every drape, shared by discerning women across the globe.",
    },

    // 6. Jayant Saree Center Heritage & Brand Story
    heritageTitle: {
      type: String,
      default: "The Jayant Saree Center Legacy",
    },
    heritageSubtitle: {
      type: String,
      default:
        "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration.",
    },
    heritageStory: {
      type: String,
      default:
        "Founded as Jayant Saree Center, our journey began with a simple yet enduring promise: to offer women the most exquisite ethnic wear, bridal drapes, and festive sarees under one roof with uncompromised quality and heartfelt personal service.",
    },
    heritagePhilosophy: {
      type: String,
      default:
        "Over the years, our brick-and-mortar boutique earned the trust of thousands of families for weddings, festivals, and milestone occasions. To take this legacy forward into the modern era, we created Ethnique By Jayant — our contemporary digital destination delivering our finest curated sarees across India.",
    },
    foundingYear: { type: String, default: "1978" },
    location: { type: String, default: "Varanasi, India" },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("HomepageSection", homepageSectionSchema);