import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../services/apiConfig.js";
import BrandLogo from "../../components/BrandLogo";
import ThemeToggle from "../../components/ThemeToggle";
import { ShieldCheck, ArrowLeft, Lock, Mail } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        identifier: formData.email.trim(),
        email: formData.email.trim(),
        phone: formData.email.trim(),
        password: formData.password,
      };

      // First try dedicated /admin/login endpoint
      let response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = await response.json();

      // Fallback to /auth/login if /admin/login is not available
      if (!response.ok) {
        const fallbackRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (fallbackRes.ok) {
          data = await fallbackRes.json();
          response = fallbackRes;
        }
      }

      if (!response.ok) {
        return alert(data.message || "Admin login failed");
      }

      const adminUser = data.user || data.admin;
      if (!adminUser || adminUser.role !== "admin") {
        return alert("Only administrators can access the admin console.");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(adminUser));
      login(adminUser, data.token);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed: " + (error.message || "Network error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] via-[#F4EDE2] to-[#EFE4D6] dark:from-[#0E0612] dark:via-[#160B1C] dark:to-[#0A040D] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      {/* Top Floating Utility Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6D1830] dark:text-[#E5C583] hover:opacity-80 transition"
        >
          <ArrowLeft size={15} />
          <span>Back to Store</span>
        </Link>

        <div className="flex items-center gap-2.5 bg-white/80 dark:bg-[#18101C]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4B483]/30 dark:border-[#2C1F32] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">Theme:</span>
          <ThemeToggle compact />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white/95 dark:bg-[#18101C]/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-[#D4B483]/50 dark:border-[#38283E] p-8 sm:p-10 transition-all duration-300">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] text-[10px] font-bold tracking-[2px] uppercase mb-2">
              <ShieldCheck size={13} />
              <span>Admin Console Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF]">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in with your administrative credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Admin Email or Mobile Number
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  required
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@ethnique.com or 10-digit mobile"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-[#FAF5EF] font-serif font-semibold text-sm tracking-wider uppercase transition-all shadow-[0_8px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_12px_25px_rgba(109,24,48,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {submitting ? "Authenticating..." : "Login to Console"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2C1F32] text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Protected Jayant Saree Center Administrative Gateway</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom subtle copyright */}
      <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Ethnique By Jayant. All Rights Reserved.
      </div>
    </div>
  );
}

export default AdminLogin;