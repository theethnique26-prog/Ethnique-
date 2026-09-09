import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig.js";
import BrandLogo from "../components/BrandLogo";
import { Mail, Lock, User, Sparkles } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isLogin
      ? `${API_BASE}/auth/login`
      : `${API_BASE}/auth/signup`;

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Login failed");
      }

      // Save user in AuthContext
      login(data.user, data.token);

      // Save in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 transition-colors duration-300">
      {/* Main Card */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 dark:bg-[#18101C]/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-[#D4B483]/50 dark:border-[#38283E] p-8 sm:p-10 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] text-[10px] font-bold tracking-[2px] uppercase mb-2">
              <Sparkles size={12} />
              <span>Royal Saree Sanctuary</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF]">
              {isLogin ? "Welcome Back" : "Join the Royal Family"}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isLogin
                ? "Sign in to access your curated wishlist & royal orders"
                : "Create your account for bespoke saree experiences"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Maharani Gayatri Devi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  required
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-[#FAF5EF] font-serif font-semibold text-sm tracking-wider uppercase transition-all shadow-[0_8px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_12px_25px_rgba(109,24,48,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-3"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create My Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2C1F32] text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isLogin ? "New to Ethnique?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#6D1830] dark:text-[#E5C583] font-semibold hover:underline"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;