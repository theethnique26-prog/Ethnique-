const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

/**
 * Helper to safely extract client IP behind proxies or directly
 */
const getClientIp = (req) => {
  if (req.headers["x-forwarded-for"]) {
    return req.headers["x-forwarded-for"].split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || "unknown-ip";
};

/**
 * 1. Global API Rate Limiter
 * Allows up to 300 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json(options.message);
  },
});

/**
 * 2. OTP Send Rate Limiter
 * Prevents SMS spam, toll fraud, and flooding.
 * Allows at most 5 OTP send requests per 10 minutes per IP & phone number.
 */
const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const rawPhone = req.body?.phone || "";
    const cleanDigits = rawPhone.toString().replace(/\D/g, "").slice(-10);
    const ip = getClientIp(req);
    return cleanDigits ? `otp_send_${ip}_${cleanDigits}` : `otp_send_${ip}`;
  },
  message: {
    success: false,
    message:
      "Too many OTP requests. For security, please wait 10 minutes before requesting another verification code.",
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json(options.message);
  },
});

/**
 * 3. OTP Verify Rate Limiter
 * Protects against brute-force attacks on 6-digit OTP codes.
 * Allows at most 10 verification attempts per 15 minutes.
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const rawPhone = req.body?.phone || "";
    const cleanDigits = rawPhone.toString().replace(/\D/g, "").slice(-10);
    const ip = getClientIp(req);
    return cleanDigits ? `otp_verify_${ip}_${cleanDigits}` : `otp_verify_${ip}`;
  },
  message: {
    success: false,
    message:
      "Too many failed OTP verification attempts. Please wait 15 minutes before trying again.",
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json(options.message);
  },
});

/**
 * 4. General Auth Rate Limiter
 * Protects login and signup endpoints from password guessing and credential stuffing.
 * Allows at most 15 requests per 15 minutes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = getClientIp(req);
    const emailOrPhone = (req.body?.email || req.body?.phone || "").trim().toLowerCase();
    return emailOrPhone ? `auth_${ip}_${emailOrPhone}` : `auth_${ip}`;
  },
  message: {
    success: false,
    message:
      "Too many login/signup attempts. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json(options.message);
  },
});

module.exports = {
  apiLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  authLimiter,
};
