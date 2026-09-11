import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig.js";
import BrandLogo from "../components/BrandLogo";
import { Mail, Lock, User, Sparkles, Phone, Eye, EyeOff, KeyRound, ArrowLeft, RotateCw, CheckCircle2 } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false); // First account creation then login option
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' | 'email'

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState("input"); // 'input' | 'otp'
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Form input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  // Resend countdown timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Request OTP from server
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        if (res.status === 404) {
          throw new Error("Route not found (404). Please restart the backend server so the new OTP routes are loaded.");
        }
        throw new Error(`Server communication error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setPhoneStep("otp");
      setResendTimer(30);
      setStatusMessage(data.message || `Code sent to +91 ${phone}`);
    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      alert(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete sign-in
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      alert("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          otp: otpCode.trim(),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from verification server");
      }

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired verification code");
      }

      login(data.user, data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      alert(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Standard Email Login or Account Registration
  const handleSubmitStandard = async (e) => {
    e.preventDefault();

    // .com only email validation check
    if (email) {
      const trimmedEmail = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.com$/i.test(trimmedEmail)) {
        alert("Please enter an email address ending with .com only (e.g. name@example.com)");
        return;
      }
    }

    setLoading(true);

    const url = isLogin
      ? `${API_BASE}/auth/login`
      : `${API_BASE}/auth/signup`;

    const body = isLogin
      ? {
          identifier: email.trim(),
          email: email.trim(),
          password,
        }
      : {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        };

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
        throw new Error(data.msg || data.message || "Authentication failed");
      }

      // Save user in AuthContext & LocalStorage
      login(data.user, data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
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
          <div className="text-center mb-7">
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
                ? loginMethod === "phone" && phoneStep === "otp"
                  ? "Enter the verification code sent to your mobile"
                  : "Sign in with OTP or your credentials"
                : "Create your account for bespoke saree experiences"}
            </p>
          </div>

          {/* Main Mode Switcher: 1) Create Account, 2) Sign In */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-[#F4EDE2]/90 dark:bg-[#120A17] border border-[#D4B483]/40">
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setPhoneStep("input");
                setOtpCode("");
              }}
              className={`
                flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                ${
                  !isLogin
                    ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <User size={14} />
              <span>1. Create Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setPhoneStep("input");
                setOtpCode("");
              }}
              className={`
                flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                ${
                  isLogin
                    ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <KeyRound size={14} />
              <span>2. Sign In</span>
            </button>
          </div>

          {/* Login Method Tabs (Phone OTP vs Email) */}
          {isLogin && (
            <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-[#F4EDE2]/80 dark:bg-[#120A17] border border-[#D4B483]/30">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("phone");
                  setPhoneStep("input");
                  setOtpCode("");
                }}
                className={`
                  flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                  ${
                    loginMethod === "phone"
                      ? "bg-white dark:bg-[#201326] text-[#6D1830] dark:text-[#E5C583] shadow-sm font-bold"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }
                `}
              >
                <Phone size={14} />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`
                  flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                  ${
                    loginMethod === "email"
                      ? "bg-white dark:bg-[#201326] text-[#6D1830] dark:text-[#E5C583] shadow-sm font-bold"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }
                `}
              >
                <Mail size={14} />
                <span>Email Login</span>
              </button>
            </div>
          )}

          {/* 1. PHONE OTP LOGIN FLOW */}
          {isLogin && loginMethod === "phone" ? (
            <div>
              {phoneStep === "input" ? (
                /* Step 1: Input Phone Number */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-700 pr-2">
                        <Phone size={15} />
                        <span className="text-xs font-semibold tracking-wide">+91</span>
                      </div>
                      <input
                        required
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(val);
                        }}
                        className="w-full pl-20 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition tracking-wider"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 pl-1">
                      A 6-digit one-time password will be sent via SMS
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-[#FAF5EF] font-serif font-semibold text-sm tracking-wider uppercase transition-all shadow-[0_8px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_12px_25px_rgba(109,24,48,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound size={16} />
                    <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Enter & Verify OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Code sent to <span className="font-semibold text-gray-900 dark:text-white">+91 {phone}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneStep("input");
                        setOtpCode("");
                      }}
                      className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={12} />
                      <span>Change</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtpCode(val);
                        }}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-center text-lg font-mono font-bold tracking-[8px] focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    {resendTimer > 0 ? (
                      <span className="text-gray-400 dark:text-gray-500">
                        Resend code in <strong className="text-gray-700 dark:text-gray-300 font-mono">{resendTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="text-[#6D1830] dark:text-[#E5C583] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw size={12} />
                        <span>Resend Verification Code</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-[#FAF5EF] font-serif font-semibold text-sm tracking-wider uppercase transition-all shadow-[0_8px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_12px_25px_rgba(109,24,48,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 2. EMAIL LOGIN OR FULL SIGNUP FLOW */
            <form onSubmit={handleSubmitStandard} className="space-y-4">
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span>Email Address</span>
                  <span className="text-[10px] text-[#B8860B] font-mono lowercase tracking-normal">(.com only)</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    required
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Mobile Number (For Express Delivery & OTP)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-700 pr-2">
                      <Phone size={15} />
                      <span className="text-xs font-semibold tracking-wide">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(val);
                      }}
                      className="w-full pl-20 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition tracking-wider"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-2 focus:ring-[#6D1830]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:from-[#561225] hover:to-[#73233D] text-[#FAF5EF] font-serif font-semibold text-sm tracking-wider uppercase transition-all shadow-[0_8px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_12px_25px_rgba(109,24,48,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? "Processing..." : isLogin ? "Sign In to Royal Sanctuary" : "Create My Royal Account"}
              </button>
            </form>
          )}

          <div className="mt-7 pt-5 border-t border-gray-100 dark:border-[#2C1F32] text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isLogin ? "New to Ethnique?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPhoneStep("input");
                  setOtpCode("");
                }}
                className="ml-2 text-[#6D1830] dark:text-[#E5C583] font-semibold hover:underline cursor-pointer"
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