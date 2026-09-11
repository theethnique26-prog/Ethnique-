const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");
const homepageRoutes =
  require("./routes/homepageRoutes");
const profileRoutes =
  require("./routes/profileRoutes");
const orderRoutes = require("./routes/orderroutes");
const customerRoutes = require("./routes/customerRoutes");
const storage = multer.memoryStorage();
const addressRoutes =
  require("./routes/addressRoutes");
const upload = multer({
  storage,
});
const reportsRoutes = require("./routes/reports");
const productRoutes = require("./routes/productroutes");
const reelRoutes = require("./routes/reels");
const userRoutes = require("./routes/userroutes");
const app = express();
const connectDB = require("./config/db");
const bannerRoutes = require("./routes/banners");
connectDB();  

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ethnique.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],
    credentials: true,
  })
);

app.use(express.json());

const { apiLimiter } = require("./middleware/rateLimiter");

app.set("trust proxy", 1);

// Normalize URLs: if request was made without /api (e.g. /products), rewrite to /api/products
app.use((req, res, next) => {
  if (
    !req.url.startsWith("/api") &&
    req.url !== "/test" &&
    req.url !== "/db-status" &&
    !req.url.startsWith("/test") &&
    !req.url.startsWith("/db-status")
  ) {
    req.url = "/api" + req.url;
  }
  next();
});

// Global rate limiting for API endpoints
app.use("/api", apiLimiter);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use(
  "/api/homepage",
  homepageRoutes 
);
app.use(
  "/api/address", addressRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/customers",
  customerRoutes
);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin/banners", bannerRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/admin/reels", reelRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/loyalty", require("./routes/loyaltyRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));



app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
app.post(
  "/api/upload/video",
  upload.single("video"),
  async (req, res) => {
    try {

      const streamUpload = () => {
        return new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                resource_type: "video",
                folder: "ethnique-videos",
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        });
      };

      const result = await streamUpload();

      res.json({
        success: true,
        videoUrl: result.secure_url,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Video upload failed",
      });
    }
  }
);
app.post(
  "/api/upload/image",
  upload.any(),
  async (req, res) => {
    try {
      const files = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);
      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const uploadOne = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "ethnique-images",
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const results = await Promise.all(files.map(uploadOne));
      const urls = results.map((r) => r.secure_url);

      res.json({
        success: true,
        imageUrl: urls[0],
        url: urls[0],
        imageUrls: urls,
        urls: urls,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

app.get("/test", (req, res) => {
  res.json({
    success: true
  });
});

app.get("/db-status", (req, res) => {
  res.json({
    readyState: require("mongoose").connection.readyState,
  });
});

// router.get("/homepage", async (req, res) => {
//   try {
//     const section =
//       await Homepage.findOne();

//     res.json(section);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});