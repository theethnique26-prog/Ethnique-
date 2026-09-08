const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const adminAuth = require("../middleware/Adminauth.js");
// const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : "";

    // Check against .env admin credentials
    if (
      adminEmail &&
      normalizedEmail === adminEmail &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ email: normalizedEmail });
      if (!admin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await User.create({
          name: process.env.ADMIN_NAME || "Admin",
          email: normalizedEmail,
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
          role: "admin",
        },
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    }

    // Check against DB user with admin role
    const admin = await User.findOne({
      email: normalizedEmail,
      role: "admin",
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
      const totalUsers =
        await User.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      res.json({
        success: true,

        stats: {
          totalUsers,
          totalProducts,
          totalOrders: 0,
          revenue: 0,
        },
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
    const products = await Product.find();

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