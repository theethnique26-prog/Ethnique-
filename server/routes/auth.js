const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const {
  authLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
} = require("../middleware/rateLimiter");

// Helper to strip non-digit formatting characters from phone
const cleanPhone = (phoneStr) => {
  if (!phoneStr) return "";
  return phoneStr.toString().replace(/[\s\-\(\)\.]/g, "");
};

// SIGNUP
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide your name, email or mobile number, and password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, msg: "JWT secret missing" });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : "";
    const rawPhone = phone ? phone.trim() : "";
    const cleanedDigits = cleanPhone(rawPhone).replace(/^\+91/, "");

    // Check if user already exists by email or phone
    const existingChecks = [];
    if (normalizedEmail) {
      existingChecks.push({ email: normalizedEmail });
    }
    if (cleanedDigits) {
      existingChecks.push({ phone: cleanedDigits });
      existingChecks.push({ phone: `+91${cleanedDigits}` });
      existingChecks.push({ phone: rawPhone });
    }

    if (existingChecks.length > 0) {
      const existingUser = await User.findOne({ $or: existingChecks });
      if (existingUser) {
        const isEmailConflict = normalizedEmail && existingUser.email === normalizedEmail;
        return res.status(400).json({
          success: false,
          msg: isEmailConflict
            ? "An account with this email address already exists"
            : "An account with this mobile number already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fallback email if only phone was provided
    const userEmail = normalizedEmail || `${cleanedDigits || Date.now()}@ethnique.internal`;

    const user = await User.create({
      name: name.trim(),
      email: userEmail,
      phone: cleanedDigits || rawPhone || "",
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 0,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ success: false, msg: err.message || "Server error" });
  }
});

// LOGIN (Supports Email or Phone Number)
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const inputIdentifier = (identifier || phone || email || "").trim();

    if (!inputIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number, and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const isEmailFormat = inputIdentifier.includes("@");
    const normalizedEmail = inputIdentifier.toLowerCase();
    const cleanedDigits = cleanPhone(inputIdentifier).replace(/^\+91/, "");
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : "";

    // ==========================
    // ADMIN LOGIN (.env match)
    // ==========================
    if (
      adminEmail &&
      (normalizedEmail === adminEmail || inputIdentifier.toLowerCase() === adminEmail) &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Ensure admin exists in MongoDB for relational queries & profile actions
      let adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        adminUser = await User.create({
          name: process.env.ADMIN_NAME || "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
      }

      const token = jwt.sign(
        {
          id: adminUser._id,
          email: adminUser.email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone || "",
          role: "admin",
          loyaltyPoints: adminUser.loyaltyPoints || 0,
        },
      });
    }

    // ==========================
    // USER / ADMIN LOGIN (Database check)
    // ==========================
    const searchConditions = [];

    if (isEmailFormat) {
      searchConditions.push({ email: normalizedEmail });
    } else {
      searchConditions.push({ email: normalizedEmail });
      if (cleanedDigits) {
        searchConditions.push({ phone: cleanedDigits });
        searchConditions.push({ phone: `+91${cleanedDigits}` });
        searchConditions.push({ phone: inputIdentifier });
      }
    }

    const user = await User.findOne({ $or: searchConditions });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Please check your email/mobile number and password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Please check your password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 0,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});

// GET CURRENT USER / VERIFY TOKEN
router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || "",
      role: req.user.role,
      loyaltyPoints: req.user.loyaltyPoints || 0,
    },
  });
});

// SEND OTP FOR PHONE LOGIN
router.post("/send-otp", otpSendLimiter, async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const cleanedDigits = cleanPhone(phone).replace(/^\+91/, "");
    if (cleanedDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Replace any existing active OTP for this phone
    await Otp.deleteMany({ phone: cleanedDigits });
    await Otp.create({
      phone: cleanedDigits,
      otp,
      expiresAt,
    });

    // If an SMS Gateway is configured (e.g. FAST2SMS), dispatch real SMS:
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY.trim(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variables_values: otp,
            route: "otp",
            numbers: cleanedDigits,
          }),
        });
        const smsData = await smsRes.json();
        console.log(`[FAST2SMS DISPATCH TO +91 ${cleanedDigits}]:`, smsData);
      } catch (smsErr) {
        console.error("[FAST2SMS GATEWAY ERROR]:", smsErr.message);
      }
    } else {
      console.log(`\n=============================================================`);
      console.log(`[ETHNIQUE OTP] Code for +91 ${cleanedDigits}: >>> ${otp} <<<`);
      console.log(`(NOTE: To deliver real SMS to mobile handsets, add FAST2SMS_API_KEY in server/.env)`);
      console.log(`=============================================================\n`);
    }

    return res.json({
      success: true,
      message: `Verification code sent to +91 ${cleanedDigits}`,
      smsSent: Boolean(process.env.FAST2SMS_API_KEY),
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send verification code",
    });
  }
});

// VERIFY OTP & SIGN IN (OR AUTO-REGISTER)
router.post("/verify-otp", otpVerifyLimiter, async (req, res) => {
  try {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and verification code are required",
      });
    }

    const cleanedDigits = cleanPhone(phone).replace(/^\+91/, "");
    const trimmedOtp = otp.toString().trim();

    const record = await Otp.findOne({ phone: cleanedDigits, otp: trimmedOtp });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check and try again.",
      });
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // OTP verified successfully - clear it
    await Otp.deleteOne({ _id: record._id });

    // Look up existing user
    let user = await User.findOne({
      $or: [
        { phone: cleanedDigits },
        { phone: `+91${cleanedDigits}` },
        { phone: `+91 ${cleanedDigits}` },
      ],
    });

    if (!user) {
      // Auto-register guest account
      const hashedPassword = await bcrypt.hash(`phone_${Date.now()}`, 10);
      user = await User.create({
        name: `Guest ${cleanedDigits.slice(-4)}`,
        email: `${cleanedDigits}@ethnique.customer`,
        phone: cleanedDigits,
        password: hashedPassword,
        role: "user",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        loyaltyPoints: user.loyaltyPoints || 0,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to verify code",
    });
  }
});

module.exports = router;