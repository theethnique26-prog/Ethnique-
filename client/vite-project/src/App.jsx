import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/homepage.jsx";
import Login from "./pages/loginpage.jsx";
import Reels from "./pages/reels.jsx";
import AllProducts from "./pages/AllProduct.jsx";
import Navbar from "../src/components/navbar.jsx";
import ProtectedRoute from "../src/pages/admin/Protectedroute.jsx"; 
import ProductDetails from "./pages/Productdetails.jsx";
// Admin Pages
import AdminLogin from "./pages/admin/Adminlogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Customers from "./pages/admin/Customers.jsx";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout.jsx";
import LoyaltyFloating from "../src/components/Loaylatyfloating.jsx";
import WhatsAppFloating from "../src/components/WhatsAppFloating.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "../src/components/Footer.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ShippingPage from "./pages/ShippingPage.jsx";
import ReturnsPage from "./pages/ReturnsPage.jsx";
import LoyaltyPage from "./pages/loyalty.jsx";
import Profile from "./pages/profile.jsx";
import Homepage from "./pages/admin/AdminHomepage.jsx";
import Banners from "./pages/admin/Banners.jsx";

// Admin Layout
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminReels from "../src/pages/admin/AdminReels.jsx";
import Reports from "./pages/admin/Reports.jsx";
import AdminAppointments from "./pages/admin/AdminAppointments.jsx";
import AnimatedRoyalBackdrop from "./components/AnimatedRoyalBackdrop.jsx";

function AppContent() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <div className={!isAdminRoute ? "traditional-heritage-canvas selection:bg-[#D4B483]/30 selection:text-[#6D1830]" : ""}>
      {!isAdminRoute && <AnimatedRoyalBackdrop />}
      <div className={!isAdminRoute ? "traditional-heritage-content" : ""}>
        {!isAdminRoute && <Navbar />}

        {!isAdminRoute && (
          <>
            <LoyaltyFloating />
            <WhatsAppFloating />
          </>
        )}

        <Routes>

      {/* Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reels" element={<Reels />} />

      <Route
        path="/products"
        element={<AllProducts />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />
      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />
    <Route
      path="/cart"
      element={<Cart />}
    />
    <Route
      path="/checkout"
      element={<Checkout />}
    />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/loyalty" element={<LoyaltyPage />} />
      <Route path="/privilege" element={<LoyaltyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/returns" element={<ReturnsPage />} />

      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />
      
      <Route
      path="/profile"
      element={<Profile />}
    />

      {/* Admin Routes */}
     <Route
      path="/admin"
      element={<AdminLayout />}
    >
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="homepage"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />

      <Route
        path="reels"
        element={
          <ProtectedRoute>
            <AdminReels />
          </ProtectedRoute>
        }
      />

      <Route
        path="banners"
        element={
          <ProtectedRoute>
            <Banners />
          </ProtectedRoute>
        }
      />
      <Route
        path="reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="appointments"
        element={
          <ProtectedRoute>
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
    </Route>
    </Routes>

    {!isAdminRoute && <Footer />}
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}


export default App;