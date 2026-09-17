# ✨ Ethnique — Luxury Indian Ethnic Wear & Heritage Boutique



> 🔗 **Live Website**: [https://ethnique.vercel.app/](https://ethnique.vercel.app/)

---

## 📌 About The Project

**Ethnique** is a modern, full-stack luxury e-commerce boutique crafted for **Jayant Saree Center** — carrying forward over **25 years of retail heritage** into a premier digital shopping experience.

The platform specializes in handcrafted Indian ethnic wear, bridal trousseaus, and artisanal sarees (Banarasi, Kanjeevaram, Chanderi, Organza, Silk, and Paithani). Ethnique blends royal heritage aesthetics with interactive shopping features such as **Shoppable Video Reels**, **Virtual Drape & Styling Appointments**, and a **Tiered Loyalty Privilege Club**.

---

## 🛠️ Frameworks & Technologies Used

### Frontend
- **[React 19](https://react.dev/)** — Core UI library with modern hooks and state management
- **[Vite 6](https://vite.dev/)** — Next-generation frontend build tool with lightning-fast HMR
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling engine with custom heritage color palettes & animations
- **[React Router DOM v6](https://reactrouter.com/)** — Client-side SPA routing and protected route layouts
- **[Recharts](https://recharts.org/)** — Interactive analytics and revenue charts for the admin dashboard
- **[Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)** — Modern iconography
- **[React Hot Toast](https://react-hot-toast.com/)** — Lightweight toast notification system
- **[XLSX (SheetJS)](https://sheetjs.com/)** — Client-side spreadsheet and Excel report generation

### Backend & API
- **[Node.js](https://nodejs.org/)** — Asynchronous server-side JavaScript runtime
- **[Express 5](https://expressjs.com/)** — Fast, unopinionated REST API framework
- **[Mongoose 8](https://mongoosejs.com/)** — Elegant MongoDB object modeling and schema management
- **[JSON Web Tokens (JWT)](https://jwt.io/)** — Secure, stateless user and admin authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** — Salted password hashing
- **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)** — API rate limiting and brute-force protection
- **[Multer](https://www.npmjs.com/package/multer) & [Streamifier](https://www.npmjs.com/package/streamifier)** — Multi-part memory storage and streaming upload pipeline

### Database & Cloud Services
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** — Fully-managed cloud NoSQL database
- **[Cloudinary](https://cloudinary.com/)** — Cloud media CDN for HD product images and video streaming
- **[Razorpay](https://razorpay.com/)** — Payment gateway supporting Cards, UPI, Net Banking, and Wallets
- **[Fast2SMS](https://www.fast2sms.com/)** — Transactional SMS OTP delivery for mobile authentication
- **[Vercel](https://vercel.com/)** — Production frontend hosting and edge CDN deployment

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Royal Heritage Aesthetics**: Dynamic royal backdrop animations, luxury typography, and smooth transitions.
- **Shoppable Video Reels**: Watch high-definition saree drape flows and purchase directly from the video player.
- **Advanced Catalog & Filters**: Filter by category, weave, fabric, price range, color, and stock availability.
- **Multi-Currency Support**: Real-time currency conversion (INR ₹, USD $, EUR €, GBP £, AED د.إ, CAD $).
- **Wishlist & Cart**: Persistent shopping cart with coupon deductions and free delivery thresholds.
- **Flexible Checkout**: Multi-address management, Razorpay payment gateway, and Cash on Delivery (COD).
- **Royal Privilege Club**: Earn points on purchases, claim periodic bonuses, and redeem points for discounts.
- **Consultation Booking**: Reserve virtual video styling sessions or in-store bridal trousseau consultations.
- **Instant WhatsApp Concierge**: Direct chat widget for real-time drape and bridal consultation.
- **Dual Authentication**: Sign in via Email/Password or instant phone OTP.

### 🛡️ Admin Management Portal (`/admin`)
- **Executive Analytics Dashboard**: Live metrics for revenue, order volume, average order value, and sales charts.
- **Product & Inventory Management**: Create, edit, and organize products with SKU tracking and multi-image Cloudinary upload.
- **Order Pipeline**: Track and update order statuses (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`).
- **Shoppable Reels CMS**: Upload and manage video reels linked directly to products.
- **Promotions & Coupons**: Create percentage or flat discount vouchers with tier restrictions and expiry dates.
- **Customer CRM**: View customer purchase histories, lifetime spend, and loyalty tiers.
- **Appointment Scheduler**: Manage styling and bridal consultations.
- **Data Export**: Export sales reports and catalog data to Excel (`.xlsx`).

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/patilarya76/Ethnique-.git
cd Ethnique-
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file using .env.example
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../client/vite-project
npm install
# Configure your .env file using .env.example
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌐 Deployment

- **Frontend**: Deployed on **[Vercel](https://vercel.com/)**  
  👉 **[https://ethnique.vercel.app/](https://ethnique.vercel.app/)**
- **Backend API**: Hosted on **[Render](https://render.com/)**

---

## 📄 License

This project is licensed under the **ISC License**.  
© **Ethnique by Jayant Saree Center** — All rights reserved.
