const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const adminAuth = require("../middleware/Adminauth.js");
const { authLimiter } = require("../middleware/rateLimiter");
// const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const inputIdentifier = (identifier || email || phone || "").trim();

    if (!inputIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number, and password are required",
      });
    }

    const normalizedEmail = (email || inputIdentifier).trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : "";
    const cleanDigits = inputIdentifier.replace(/[\s\-\(\)\.]/g, "").replace(/^\+91/, "");
    const isEmailFormat = inputIdentifier.includes("@") || (Boolean(email) && email.includes("@"));

    // ==========================================
    // SECURITY CHECK: Enforce @gmail.com only for email login
    // ==========================================
    if (isEmailFormat) {
      const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(normalizedEmail);
      if (!isGmail) {
        return res.status(400).json({
          success: false,
          message: "Security restriction: Only @gmail.com email addresses are allowed.",
        });
      }
    }

    // Check against .env admin credentials
    if (
      adminEmail &&
      (normalizedEmail === adminEmail || inputIdentifier.toLowerCase() === adminEmail) &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await User.create({
          name: process.env.ADMIN_NAME || "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });
      } else if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
      }

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone || "",
          role: "admin",
        },
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone || "",
          role: "admin",
        },
      });
    }

    // Check against DB user with admin role
    const searchConditions = [
      { email: normalizedEmail, role: "admin" },
    ];
    if (cleanDigits) {
      searchConditions.push({ phone: cleanDigits, role: "admin" });
      searchConditions.push({ phone: `+91${cleanDigits}`, role: "admin" });
      searchConditions.push({ phone: inputIdentifier, role: "admin" });
    }

    const admin = await User.findOne({
      $or: searchConditions,
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// router.get(
//   "/dashboard",
//   adminAuth,
//   async (req, res) => {
  router.get("/dashboard", adminAuth, async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();

      const validOrders = await Order.find({ orderStatus: { $ne: "Cancelled" } });
      const revenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const recentOrders = await Order.find()
        .populate("customer", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

      const recentOrdersFormatted = recentOrders.map((o) => ({
        id: `#ORD-${String(o._id).slice(-4).toUpperCase()}`,
        amount: `₹${Number(o.totalAmount || 0).toLocaleString("en-IN")}`,
        status: o.orderStatus,
        customerName: o.customer?.name || "Customer",
      }));

      // Top products sold from orders
      const productSalesMap = {};
      validOrders.forEach((order) => {
        (order.items || []).forEach((item) => {
          const name = item.name || (item.product && item.product.name);
          if (name) {
            productSalesMap[name] = (productSalesMap[name] || 0) + (item.quantity || 1);
          }
        });
      });

      const topProducts = Object.entries(productSalesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Active coupons count and list
      const activeCoupons = await Coupon.find({ isActive: true }).limit(5);

      // Generate last 7 days sales timeline from valid orders
      const days = 7;
      const salesTimeline = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayLabel = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const startOfDay = new Date(d.setHours(0, 0, 0, 0));
        const endOfDay = new Date(d.setHours(23, 59, 59, 999));

        const dayRevenue = validOrders
          .filter((o) => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= startOfDay && orderDate <= endOfDay;
          })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        salesTimeline.push({
          day: dayLabel,
          sales: dayRevenue,
        });
      }

      res.json({
        success: true,
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          revenue,
        },
        recentOrders: recentOrdersFormatted,
        topProducts,
        activeCoupons,
        salesTimeline,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/check-token", adminAuth, (req, res) => {
  res.json({
    success: true,
    admin: {
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

router.get("/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Helper to normalize product and photos from Excel or manual forms
const normalizeProductPayload = (item, idx = 0) => {
  const p = { ...item };
  const rawList = [];

  // 1. Multi-column fields (image1..image10, photo1..photo10, etc.)
  for (let i = 1; i <= 10; i++) {
    const val =
      p[`image${i}`] ||
      p[`Image${i}`] ||
      p[`Image ${i}`] ||
      p[`photo${i}`] ||
      p[`Photo${i}`] ||
      p[`Photo ${i}`];
    if (val && typeof val === "string" && val.trim()) {
      rawList.push(val.trim());
    }
  }

  // 2. Compound fields (images, Photos, image, etc.)
  const compound =
    p.images ||
    p.Images ||
    p.photos ||
    p.Photos ||
    p["Image URLs"] ||
    p["Photo URLs"] ||
    p.image ||
    p.Image ||
    p["Image URL"] ||
    p["Photo URL"];

  if (Array.isArray(compound)) {
    compound.forEach((img) => {
      if (typeof img === "string" && img.trim()) rawList.push(img.trim());
    });
  } else if (typeof compound === "string" && compound.trim()) {
    compound.split(/[\r\n,;|]+/).forEach((img) => {
      if (img.trim()) rawList.push(img.trim());
    });
  }

  // 3. Clean and convert URLs (including Google Drive view links to direct view)
  const cleaned = rawList
    .map((url) => {
      if (!url || typeof url !== "string") return "";
      let u = url.trim().replace(/^['"]|['"]$/g, "");
      const gdriveMatch = u.match(
        /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/
      );
      if (gdriveMatch && gdriveMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${gdriveMatch[1]}&sz=w1600`;
      }
      return u;
    })
    .filter(Boolean);

  const uniqueImages = Array.from(new Set(cleaned));
  const finalImages =
    uniqueImages.length > 0
      ? uniqueImages
      : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c"];

  p.images = finalImages;
  p.image = finalImages[0] || "";
  p.priceINR = Number(p.priceINR) || 1999;
  p.stock = Number(p.stock) >= 0 ? Number(p.stock) : 10;
  p.inStock = p.inStock !== false && p.stock > 0;
  if (p.showOnHomepage !== undefined) {
    p.showOnHomepage = Boolean(p.showOnHomepage);
  }
  if (!p.sku || !String(p.sku).trim()) {
    p.sku = `ETH-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`;
  } else {
    p.sku = String(p.sku).trim();
  }
  return p;
};

router.post("/products", adminAuth, async (req, res) => {
  try {
    const normalized = normalizeProductPayload(req.body);

    if (normalized.showOnHomepage) {
      const currentCount = await Product.countDocuments({ showOnHomepage: true });
      if (currentCount >= 6) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum 6 sarees can be displayed on homepage. Please uncheck another saree first.",
        });
      }
    }

    const product = await Product.create(normalized);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("POST PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/products/bulk", adminAuth, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty array of products",
      });
    }

    const normalized = products.map((item, idx) => normalizeProductPayload(item, idx));

    const bulkOps = normalized.map((p) => ({
      updateOne: {
        filter: { sku: p.sku },
        update: { $set: p },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(bulkOps);
    const totalAffected = (result.upsertedCount || 0) + (result.modifiedCount || 0);

    res.status(200).json({
      success: true,
      count: totalAffected || normalized.length,
      upserted: result.upsertedCount || 0,
      modified: result.modifiedCount || 0,
      message: `Successfully processed ${normalized.length} sarees (${result.upsertedCount || 0} new added, ${result.modifiedCount || 0} updated with photos & details)!`,
    });
  } catch (error) {
    console.error("BULK PRODUCT IMPORT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const normalized = normalizeProductPayload(req.body);

    if (normalized.showOnHomepage) {
      const currentCount = await Product.countDocuments({
        showOnHomepage: true,
        _id: { $ne: req.params.id },
      });
      if (currentCount >= 6) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum 6 sarees can be displayed on homepage. Please uncheck another saree first.",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, normalized, { new: true });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Toggle Show on Homepage display (Max 6 sarees)
router.patch("/products/:id/toggle-homepage", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const nextStatus = !product.showOnHomepage;

    if (nextStatus) {
      const currentFeaturedCount = await Product.countDocuments({
        showOnHomepage: true,
        _id: { $ne: product._id },
      });
      if (currentFeaturedCount >= 6) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum 6 sarees can be displayed on the homepage. Please unselect another saree first.",
          currentCount: currentFeaturedCount,
        });
      }
    }

    product.showOnHomepage = nextStatus;
    await product.save();

    const totalCount = await Product.countDocuments({ showOnHomepage: true });

    res.json({
      success: true,
      product,
      showOnHomepage: product.showOnHomepage,
      totalCount,
      message: product.showOnHomepage
        ? `Added '${product.name}' to Homepage display (${totalCount}/6 selected).`
        : `Removed '${product.name}' from Homepage display (${totalCount}/6 selected).`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product stock and inStock status (supports both PATCH and PUT)
const handleToggleStockRequest = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 1. If custom stock amount is specified by admin
    if (req.body.stock !== undefined && req.body.stock !== null && req.body.stock !== "") {
      const stockNum = Math.max(0, parseInt(req.body.stock, 10) || 0);
      product.stock = stockNum;
      if (typeof req.body.inStock === "boolean") {
        product.inStock = req.body.inStock;
      } else {
        product.inStock = stockNum > 0;
      }
    } else {
      // 2. Simple toggle of inStock state
      const targetInStock = typeof req.body.inStock === "boolean" 
        ? req.body.inStock 
        : product.inStock === false ? true : false;

      product.inStock = targetInStock;

      if (!targetInStock) {
        product.stock = 0;
      } else if (targetInStock && (Number(product.stock) <= 0 || product.stock === undefined)) {
        product.stock = 10; // Default restock if previously 0
      }
    }

    await product.save();

    res.json({
      success: true,
      product,
      message: `Stock updated to ${product.stock} (${product.inStock ? "In Stock" : "Out of Stock"})`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

router.patch("/products/:id/toggle-stock", adminAuth, handleToggleStockRequest);
router.put("/products/:id/toggle-stock", adminAuth, handleToggleStockRequest);
router.patch("/products/:id/stock", adminAuth, handleToggleStockRequest);
router.put("/products/:id/stock", adminAuth, handleToggleStockRequest);

router.get("/products/:id", adminAuth, async (req, res) => {
  console.log(
    "PRODUCT DETAILS ROUTE HIT:",
    req.params.id
  );

  try {
    const product = await Product.findById(
      req.params.id
    );

    console.log(product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;