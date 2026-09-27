import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig.js";
import BrandLogo from "../components/BrandLogo";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  Phone,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();

  // Create Account is default, unless query parameter ?mode=signin is specified
  const [isLogin, setIsLogin] = useState(() => {
    const mode = searchParams.get("mode");
    return mode === "signin" || mode === "login";
  });

  // Sign In method: 'phone' (Mobile OTP) or 'email' (Email + Password)
  const [signInMethod, setSignInMethod] = useState("phone");

  // Create Account State
  const [createStep, setCreateStep] = useState("form"); // 'form' | 'otp'
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regOtp, setRegOtp] = useState("");
  const [regTimer, setRegTimer] = useState(0);

  // Sign In State (Phone OTP)
  const [signInPhoneStep, setSignInPhoneStep] = useState("input"); // 'input' | 'otp'
  const [signInPhone, setSignInPhone] = useState("");
  const [signInOtp, setSignInOtp] = useState("");
  const [signInTimer, setSignInTimer] = useState(0);

  // Sign In State (Email + Password)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signin" || mode === "login") {
      setIsLogin(true);
    } else if (mode === "signup" || mode === "create-account") {
      setIsLogin(false);
    }
  }, [searchParams]);

  // Timer countdown for registration OTP
  useEffect(() => {
    let interval = null;
    if (regTimer > 0) {
      interval = setInterval(() => setRegTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [regTimer]);

  // Timer countdown for sign-in OTP
  useEffect(() => {
    let interval = null;
    if (signInTimer > 0) {
      interval = setInterval(() => setSignInTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [signInTimer]);

  const resetErrors = () => {
    setErrorMsg("");
    setStatusMsg("");
  };

  // =========================================================================
  // 1. CREATE ACCOUNT: STEP 1 - Send OTP to Mobile
  // =========================================================================
  const handleRegisterSendOtp = async (e) => {
    if (e) e.preventDefault();
    resetErrors();

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMsg("Please enter your full name");
      return;
    }

    if (!regEmail.trim() || !regEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (!regPhone || regPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: regPhone.trim(),
          email: regEmail.trim(),
          purpose: "register",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setCreateStep("otp");
      setRegTimer(30);
      setStatusMsg(data.message || `Verification code sent to +91 ${regPhone}`);
    } catch (err) {
      console.error("REGISTER SEND OTP ERROR:", err);
      setErrorMsg(err.message || "Could not send verification code");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 1. CREATE ACCOUNT: STEP 2 - Verify OTP and complete registration
  // =========================================================================
  const handleRegisterVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    resetErrors();

    if (!regOtp || regOtp.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: regPhone.trim(),
          otp: regOtp.trim(),
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

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
      console.error("REGISTER VERIFY OTP ERROR:", err);
      setErrorMsg(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 2. SIGN IN VIA PHONE: STEP 1 - Send OTP
  // =========================================================================
  const handleSignInSendOtp = async (e) => {
    if (e) e.preventDefault();
    resetErrors();

    if (!signInPhone || signInPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: signInPhone.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setSignInPhoneStep("otp");
      setSignInTimer(30);
      setStatusMsg(data.message || `Code sent to +91 ${signInPhone}`);
    } catch (err) {
      console.error("SIGN IN SEND OTP ERROR:", err);
      setErrorMsg(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 2. SIGN IN VIA PHONE: STEP 2 - Verify OTP & Log In
  // =========================================================================
  const handleSignInVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    resetErrors();

    if (!signInOtp || signInOtp.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: signInPhone.trim(),
          otp: signInOtp.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

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
      console.error("SIGN IN VERIFY OTP ERROR:", err);
      setErrorMsg(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 3. SIGN IN VIA EMAIL & PASSWORD
  // =========================================================================
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    resetErrors();

    if (!loginEmail.trim()) {
      setErrorMsg("Please enter your email address");
      return;
    }

    if (!loginPassword) {
      setErrorMsg("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginEmail.trim(),
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.msg || "Invalid email or password");
      }

      login(data.user, data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("EMAIL LOGIN ERROR:", err);
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 dark:bg-[#18101C]/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(109,24,48,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#D4B483]/40 dark:border-[#38283E] p-7 sm:p-9 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2.5">
              <BrandLogo />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6D1830]/8 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] text-[10px] font-bold tracking-[2px] uppercase mb-2">
              <Sparkles size={11} />
              <span>Royal Saree Sanctuary</span>
            </div>

            <h1 className="text-2xl sm:text-[28px] font-serif font-bold text-gray-900 dark:text-[#FAF5EF] tracking-tight">
              {!isLogin ? "Create Account" : "Welcome Back"}
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
              {!isLogin
                ? createStep === "otp"
                  ? "Enter the 6-digit code sent to your mobile"
                  : "Join Ethnique for bespoke sarees and exclusive perks"
                : signInMethod === "phone"
                ? signInPhoneStep === "otp"
                  ? "Enter the verification code sent to your phone"
                  : "Sign in instantly with your verified mobile number"
                : "Sign in with your email address and password"}
            </p>
          </div>

          {/* Luxury Tab Switcher (Create Account vs Sign In) */}
          <div className="flex border-b border-gray-200 dark:border-[#2C1F32] mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setCreateStep("form");
                setRegOtp("");
                resetErrors();
              }}
              className={`flex-1 pb-3 text-xs font-serif font-bold tracking-[1.5px] uppercase transition-all relative cursor-pointer ${
                !isLogin
                  ? "text-[#6D1830] dark:text-[#E5C583]"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Create Account
              {!isLogin && (
                <span className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-[#6D1830] dark:bg-[#E5C583] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setSignInPhoneStep("input");
                setSignInOtp("");
                resetErrors();
              }}
              className={`flex-1 pb-3 text-xs font-serif font-bold tracking-[1.5px] uppercase transition-all relative cursor-pointer ${
                isLogin
                  ? "text-[#6D1830] dark:text-[#E5C583]"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Sign In
              {isLogin && (
                <span className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-[#6D1830] dark:bg-[#E5C583] rounded-full" />
              )}
            </button>
          </div>

          {/* Status & Error Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium text-center animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {statusMsg && !errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 size={14} />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 1: CREATE ACCOUNT                                            */}
          {/* ================================================================= */}
          {!isLogin ? (
            <div>
              {createStep === "form" ? (
                /* Step 1: Input details */
                <form onSubmit={handleRegisterSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Gayatri Devi"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Mobile Number (OTP Sent Here)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1 text-gray-500 border-r border-gray-300 dark:border-gray-700 pr-2">
                        <Phone size={14} />
                        <span className="text-xs font-semibold">+91</span>
                      </div>
                      <input
                        required
                        type="tel"
                        placeholder="98765 43210"
                        value={regPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setRegPhone(val);
                        }}
                        className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition tracking-wider"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Set Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type={showRegPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        aria-label={showRegPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || regPhone.length < 10 || !regName || !regEmail || regPassword.length < 6}
                    className="w-full py-3.5 rounded-xl bg-[#6D1830] hover:bg-[#561225] dark:bg-[#E5C583] dark:hover:bg-[#d6b36a] text-white dark:text-[#18101C] font-serif font-bold text-xs tracking-[1.5px] uppercase transition-all shadow-[0_6px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_8px_25px_rgba(109,24,48,0.35)] active:scale-[0.99] disabled:opacity-50 mt-3 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound size={15} />
                    <span>{loading ? "Sending OTP..." : "Send OTP & Create Account"}</span>
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleRegisterVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Code sent to <span className="font-semibold text-gray-900 dark:text-white">+91 {regPhone}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateStep("form");
                        setRegOtp("");
                        resetErrors();
                      }}
                      className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={12} />
                      <span>Change</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        placeholder="••••••"
                        value={regOtp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setRegOtp(val);
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] text-center text-xl font-mono font-bold tracking-[8px] focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    {regTimer > 0 ? (
                      <span className="text-gray-400">
                        Resend in <strong className="text-gray-700 dark:text-gray-300 font-mono">{regTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRegisterSendOtp}
                        disabled={loading}
                        className="text-[#6D1830] dark:text-[#E5C583] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw size={12} />
                        <span>Resend OTP Code</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || regOtp.length < 6}
                    className="w-full py-3.5 rounded-xl bg-[#6D1830] hover:bg-[#561225] dark:bg-[#E5C583] dark:hover:bg-[#d6b36a] text-white dark:text-[#18101C] font-serif font-bold text-xs tracking-[1.5px] uppercase transition-all shadow-[0_6px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_8px_25px_rgba(109,24,48,0.35)] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    <span>{loading ? "Verifying..." : "Verify & Complete Registration"}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* =============================================================== */
            /* VIEW 2: SIGN IN                                                 */
            /* =============================================================== */
            <div>
              {signInMethod === "phone" ? (
                /* Primary Sign In: Mobile OTP (Like Zomato/Myntra) */
                <div>
                  {signInPhoneStep === "input" ? (
                    <form onSubmit={handleSignInSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Registered Mobile Number
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3.5 flex items-center gap-1 text-gray-500 border-r border-gray-300 dark:border-gray-700 pr-2">
                            <Phone size={14} />
                            <span className="text-xs font-semibold">+91</span>
                          </div>
                          <input
                            required
                            type="tel"
                            placeholder="98765 43210"
                            value={signInPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setSignInPhone(val);
                            }}
                            className="w-full pl-20 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition tracking-wider"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || signInPhone.length < 10}
                        className="w-full py-3.5 rounded-xl bg-[#6D1830] hover:bg-[#561225] dark:bg-[#E5C583] dark:hover:bg-[#d6b36a] text-white dark:text-[#18101C] font-serif font-bold text-xs tracking-[1.5px] uppercase transition-all shadow-[0_6px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_8px_25px_rgba(109,24,48,0.35)] active:scale-[0.99] disabled:opacity-50 mt-1 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <KeyRound size={15} />
                        <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignInVerifyOtp} className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Code sent to <span className="font-semibold text-gray-900 dark:text-white">+91 {signInPhone}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSignInPhoneStep("input");
                            setSignInOtp("");
                            resetErrors();
                          }}
                          className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeft size={12} />
                          <span>Change</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 text-center">
                          Enter 6-Digit OTP
                        </label>
                        <div className="relative">
                          <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            required
                            type="text"
                            inputMode="numeric"
                            autoFocus
                            placeholder="••••••"
                            value={signInOtp}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setSignInOtp(val);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] text-center text-xl font-mono font-bold tracking-[8px] focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        {signInTimer > 0 ? (
                          <span className="text-gray-400">
                            Resend in <strong className="text-gray-700 dark:text-gray-300 font-mono">{signInTimer}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSignInSendOtp}
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
                        disabled={loading || signInOtp.length < 6}
                        className="w-full py-3.5 rounded-xl bg-[#6D1830] hover:bg-[#561225] dark:bg-[#E5C583] dark:hover:bg-[#d6b36a] text-white dark:text-[#18101C] font-serif font-bold text-xs tracking-[1.5px] uppercase transition-all shadow-[0_6px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_8px_25px_rgba(109,24,48,0.35)] active:scale-[0.99] disabled:opacity-50 mt-1 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={16} />
                        <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
                      </button>
                    </form>
                  )}

                  {/* Sleek divider & switch to Email & Password */}
                  {signInPhoneStep === "input" && (
                    <div className="mt-6">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200 dark:border-[#2C1F32]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[1.5px]">
                          <span className="bg-white dark:bg-[#18101C] px-3 text-gray-400">or sign in with</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSignInMethod("email");
                          resetErrors();
                        }}
                        className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] hover:border-[#D4B483] text-gray-700 dark:text-gray-300 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <Mail size={14} className="text-[#6D1830] dark:text-[#E5C583]" />
                        <span>Email & Password</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Alternative Sign In: Email & Password */
                <div>
                  <form onSubmit={handleEmailPasswordLogin} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-900 dark:text-[#FAF5EF] placeholder-gray-400 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !loginEmail || !loginPassword}
                      className="w-full py-3.5 rounded-xl bg-[#6D1830] hover:bg-[#561225] dark:bg-[#E5C583] dark:hover:bg-[#d6b36a] text-white dark:text-[#18101C] font-serif font-bold text-xs tracking-[1.5px] uppercase transition-all shadow-[0_6px_20px_rgba(109,24,48,0.25)] hover:shadow-[0_8px_25px_rgba(109,24,48,0.35)] active:scale-[0.99] disabled:opacity-50 mt-1 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <KeyRound size={15} />
                      <span>{loading ? "Signing In..." : "Sign In to Royal Sanctuary"}</span>
                    </button>
                  </form>

                  {/* Sleek divider & switch to Mobile OTP */}
                  <div className="mt-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-[#2C1F32]" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-[1.5px]">
                        <span className="bg-white dark:bg-[#18101C] px-3 text-gray-400">or sign in with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSignInMethod("phone");
                        setSignInPhoneStep("input");
                        resetErrors();
                      }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] hover:border-[#D4B483] text-gray-700 dark:text-gray-300 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <Phone size={14} className="text-[#6D1830] dark:text-[#E5C583]" />
                      <span>Mobile OTP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Switcher Note */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2C1F32] text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLogin ? "New to Ethnique?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCreateStep("form");
                  setSignInPhoneStep("input");
                  setRegOtp("");
                  setSignInOtp("");
                  resetErrors();
                }}
                className="ml-1.5 text-[#6D1830] dark:text-[#E5C583] font-semibold hover:underline cursor-pointer"
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