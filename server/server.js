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

const storage = multer.memoryStorage();
const addressRoutes =
  require("./routes/addressRoutes");
const upload = multer({
  storage,
});
const productRoutes = require("./routes/productroutes");
// const reelRoutes =
//   require("./routes/reelRoutes");
const userRoutes = require("./routes/userroutes");
const app = express();
const connectDB = require("./config/db");
connectDB();  

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ethnique.netlify.app",
    ],
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
// app.use(
//   "/api/reels",
//   reelRoutes
// );



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