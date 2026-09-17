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

router.post("/products", adminAuth, async (req, res) => {
  try {
    console.log("BODY RECEIVED:");
    console.log(req.body);

    const product = await Product.create(req.body);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("POST PRODUCT ERROR:");
    console.log(error);

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

    const created = await Product.insertMany(products);
    res.status(201).json({
      success: true,
      count: created.length,
      products: created,
      message: `Successfully imported ${created.length} products!`,
    });
  } catch (error) {
    console.error("BULK PRODUCT IMPORT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/products/:id", adminAuth, async (req, res) => {
    try {
      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.put("/products/:id", adminAuth, async (req, res) => {
    try {
      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

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
  }
);

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