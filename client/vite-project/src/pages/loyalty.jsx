import React, { useState, useEffect } from "react";
import {
  Crown,
  Sparkles,
  Gift,
  Tag,
  Copy,
  Check,
  ShoppingBag,
  Truck,
  ArrowRight,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Percent,
  Flame,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoyalty } from "../context/LoyaltyContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig";
import toast from "react-hot-toast";

// Curated, ready-to-use coupons (Myntra Glam Clan style)
const GLAM_COUPONS = [
  {
    id: "firstglam",
    code: "FIRSTGLAM",
    discount: "₹200 OFF",
    type: "flat",
    title: "New Member Welcome Gift",
    minOrder: "Min. order ₹1,499",
    description: "Applicable on your first saree purchase at Ethnique.",
    badge: "Welcome Offer",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    popular: true,
  },
  {
    id: "glam500",
    code: "GLAM500",
    discount: "₹500 OFF",
    type: "flat",
    title: "Chanderi & Festive Special",
    minOrder: "Min. order ₹3,499",
    description: "Flat savings on all designer festive drapes.",
    badge: "Most Popular",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    popular: true,
  },
  {
    id: "festive15",
    code: "FESTIVE15",
    discount: "EXTRA 15% OFF",
    type: "percent",
    title: "Festive & Wedding Season",
    minOrder: "Min. order ₹2,999",
    description: "Save up to ₹1,200 on festive drapes & party wear.",
    badge: "Trending",
    badgeColor: "bg-[#8C2F4D]/15 text-[#8C2F4D] dark:text-[#E8C58D] border-[#8C2F4D]/30",
    popular: false,
  },
  {
    id: "freeship",
    code: "FREESHIP",
    discount: "FREE DELIVERY",
    type: "shipping",
    title: "Zero Shipping Pan-India",
    minOrder: "No minimum purchase",
    description: "Standard doorstep delivery free on all sarees.",
    badge: "All Members",
    badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    popular: false,
  },
  {
    id: "ultimate1000",
    code: "ULTIMATE1000",
    discount: "₹1,000 OFF",
    type: "flat",
    title: "Pure Kanjivaram & Silk Vault",
    minOrder: "Min. order ₹7,999",
    description: "High-value privilege code for premium bridal silks.",
    badge: "VIP Exclusive",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    popular: true,
  },
  {
    id: "silk10",
    code: "SILK10",
    discount: "FLAT 10% OFF",
    type: "percent",
    title: "Banarasi & Heritage Drapes",
    minOrder: "Min. order ₹3,999",
    description: "Instant 10% discount on all gold zari sarees.",
    badge: "Festive Pick",
    badgeColor: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30",
    popular: false,
  },
  {
    id: "bday350",
    code: "BDAY350",
    discount: "₹350 OFF",
    type: "flat",
    title: "Birthday Month Celebration",
    minOrder: "Min. order ₹2,499",
    description: "A special gift voucher for your birthday month celebration.",
    badge: "Special Perk",
    badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
    popular: false,
  },
  {
    id: "ethnic100",
    code: "ETHNIC100",
    discount: "₹100 OFF",
    type: "flat",
    title: "Everyday Cotton & Linen",
    minOrder: "Min. order ₹999",
    description: "Flat discount on everyday breathable office & casual sarees.",
    badge: "Quick Saver",
    badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    popular: false,
  },
];

// 3 Simple Privilege Club Membership Tiers
const GLAM_TIERS = [
  {
    id: "insider",
    name: "Club Insider",
    subtitle: "Level 1 • Auto Unlocked",
    minPts: 0,
    maxPts: 499,
    tagline: "Welcome to the Club",
    badge: "Entry Tier",
    badgeStyle: "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300",
    cardGradient: "from-stone-50 to-amber-50/40 dark:from-[#18111A] dark:to-[#221424]",
    perks: [
      "Standard delivery on orders above ₹999",
      "Welcome voucher code FIRSTGLAM (₹200 OFF)",
      "Earn 1 Club Point on every ₹10 spent (1 pt = ₹5)",
    ],
  },
  {
    id: "elite",
    name: "Club Elite",
    subtitle: "Level 2 • 500+ Points",
    minPts: 500,
    maxPts: 1499,
    tagline: "Active Shopper Status",
    popular: true,
    badge: "Most Popular",
    badgeStyle: "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white border-transparent shadow-sm",
    cardGradient: "from-[#FDF8F0] via-[#FAF1E3] to-[#F5E6CE] dark:from-[#291722] dark:via-[#351A2C] dark:to-[#23121E]",
    perks: [
      "Free Delivery on ALL orders (zero minimum purchase)",
      "Extra 5% Instant Discount code ELITE5 on checkout",
      "12-Hour Early Access to big seasonal sale drops",
      "Earn 1.5x points on all saree purchases",
    ],
  },
  {
    id: "ultimate",
    name: "VIP Royal Club",
    subtitle: "Level 3 • 1,500+ Points",
    minPts: 1500,
    maxPts: Infinity,
    tagline: "VIP Royal Status",
    badge: "VIP Highest Tier",
    badgeStyle: "bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-[#E8C58D] border-[#E8C58D]/40 shadow-sm",
    cardGradient: "from-[#FDF3F5] via-[#F8E2E8] to-[#F3D1DC] dark:from-[#351322] dark:via-[#44182C] dark:to-[#280C19]",
    perks: [
      "2x points earning on all saree purchases",
      "Free Delivery on all orders pan-India",
      "Flat 10% OFF code ULTIMATE10 on every single purchase",
      "24-Hour VIP Early Sale Access before anyone else",
    ],
  },
];

// Simple 3 Steps
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Shop Sarees",
    desc: "Earn Club points automatically with every saree you purchase (1 pt = ₹5).",
    icon: ShoppingBag,
  },
  {
    step: "02",
    title: "Copy Instant Coupons",
    desc: "Grab any discount code with 1 click and paste at checkout for instant off.",
    icon: Tag,
  },
  {
    step: "03",
    title: "Unlock VIP Royal Club",
    desc: "Reach VIP Royal Club for 2x points earning, Free Delivery, and 24h early access.",
    icon: Crown,
  },
];

// Short, clear FAQs
const SIMPLE_FAQS = [
  {
    q: "How do I use a coupon code?",
    a: "Simply click 'Copy Code' on any coupon card above. At checkout, paste the code in the promo/coupon box, and your discount will be applied immediately.",
  },
  {
    q: "How do I upgrade to VIP Royal Club?",
    a: "You automatically upgrade as you accumulate points from purchases (1 point per ₹10 spent). Once you cross 1,500 points, your pass updates to VIP Royal Club instantly with 2x points earning!",
  },
  {
    q: "Can I use coupons with Free Delivery?",
    a: "Yes! Club Elite and VIP Royal members get free delivery automatically on all orders, so you can still apply any flat discount coupon code on top.",
  },
];

function Loyalty() {
  const { points, tier, canClaimBonus, nextClaimInHours, claimDailyBonus } = useLoyalty();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'flat' | 'percent' | 'shipping' | 'vip'
  const [activeFaq, setActiveFaq] = useState(null);
  const [coupons, setCoupons] = useState(GLAM_COUPONS);
  const [claiming, setClaiming] = useState(false);

  const currentPoints = points || 0;

  // Protect page: redirect unauthenticated users to login
  useEffect(() => {
    if (!user) {
      toast("Please sign in to access your Privilege Club rewards", { icon: "👑" });
      navigate("/login", { state: { from: "/loyalty" } });
    }
  }, [user, navigate]);

  // Fetch active coupons from backend if available
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE}/coupons`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.coupons) && data.coupons.length > 0) {
            const mapped = data.coupons.map((c) => ({
              id: c._id || c.code,
              code: c.code,
              discount:
                c.discountType === "shipping"
                  ? "FREE SHIP"
                  : c.discountType === "percentage"
                  ? `${c.discountValue}% OFF`
                  : `₹${c.discountValue} OFF`,
              type: c.discountType === "percentage" ? "percent" : c.discountType,
              title: c.title,
              minOrder: `Min. order ₹${c.minOrderAmount.toLocaleString("en-IN")}`,
              description: c.description,
              badge: c.badge || "Special Offer",
              badgeColor:
                c.badge?.includes("VIP")
                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                  : c.badge?.includes("Favorite") || c.badge?.includes("Exclusive")
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
              popular: Boolean(c.popular),
            }));
            setCoupons(mapped);
          }
        }
      } catch (err) {
        console.log("Using curated coupons list:", err);
      }
    };
    fetchActiveCoupons();
  }, []);

  // Determine current member tier from backend tier or fallback
  const currentTierName = tier?.name || (currentPoints >= 1500 ? "VIP Royal Club" : currentPoints >= 500 ? "Club Elite" : "Club Insider");
  const nextTierName = tier?.nextTier || (currentPoints >= 1500 ? "Highest Status" : currentPoints >= 500 ? "VIP Royal Club" : "Club Elite");
  const pointsNeeded = tier?.pointsNeeded !== undefined ? tier.pointsNeeded : Math.max(0, 500 - currentPoints);
  const progressPercent = tier?.progressPercent !== undefined ? tier.progressPercent : Math.min((currentPoints / 500) * 100, 100);

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied! Paste at checkout.`, {
      icon: "🎟️",
      duration: 3000,
    });
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2800);
  };

  const handleClaimPoints = async () => {
    setClaiming(true);
    await claimDailyBonus();
    setClaiming(false);
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "flat") return coupon.type === "flat";
    if (activeFilter === "percent") return coupon.type === "percent";
    if (activeFilter === "shipping") return coupon.type === "shipping";
    if (activeFilter === "vip") return coupon.badge?.includes("VIP") || coupon.badge?.includes("Elite");
    return true;
  });

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-500 pb-28">
      {/* 1. Header / Hero Section */}
      <section className="relative pt-8 pb-10 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/50 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Crown size={14} className="text-[#B8860B]" />
            <span>Ethnique Privilege • VIP Royal Club</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Member Coupons & Privilege Club
          </h1>

          <p className="mt-3.5 text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Instant copy coupons, flat checkout savings (1 pt = ₹5), and Free Delivery perks.
          </p>
        </div>
      </section>

      {/* 2. Myntra-Style VIP Member Glam Pass Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-[28px] p-1 bg-gradient-to-r from-[#B8860B] via-[#E8C58D] to-[#8C2F4D] shadow-2xl">
          <div className="rounded-[26px] bg-gradient-to-br from-[#180C14] via-[#240E1B] to-[#11060E] text-[#FAF7F2] p-6 sm:p-8 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#D4B483]/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#8C2F4D]/25 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Left Details */}
              <div className="space-y-3 max-w-lg">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#D4B483]/20 border border-[#D4B483]/40 text-xs font-serif uppercase tracking-widest text-[#E8C58D] flex items-center gap-1.5 font-semibold">
                    <Crown size={13} className="text-[#D4B483]" />
                    {currentTierName}
                  </span>
                  <span className="text-xs text-white/50 font-mono">
                    ID: #GLAM-{String(currentPoints + 1200).slice(-4)}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#FAF7F2]">
                    VIP Royal Club Pass
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
                    Use member coupons below at checkout for instant discounts. (1 pt = ₹5)
                  </p>
                </div>

                {/* Progress to Next Tier */}
                {pointsNeeded > 0 ? (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-[#E8C58D] font-mono mb-1.5">
                      <span>Tier Status</span>
                      <span>{pointsNeeded} pts to {nextTierName}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#B8860B] via-[#E8C58D] to-[#D4B483] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(212,180,131,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#E8C58D] flex items-center gap-1.5 font-medium pt-1">
                    <Sparkles size={14} />
                    <span>Unlocked: VIP Royal Club Status (2x Points)</span>
                  </div>
                )}
              </div>

              {/* Right Points Box */}
              <div className="w-full md:w-auto flex flex-col items-center md:items-end justify-center rounded-2xl bg-white/10 border border-[#D4B483]/30 backdrop-blur-md p-5 text-center md:text-right shadow-inner">
                <span className="text-[11px] uppercase tracking-widest text-[#E8C58D] font-medium">
                  Available Balance
                </span>
                <div className="text-4xl font-serif font-bold text-white mt-1 flex items-baseline gap-1">
                  <span>{currentPoints}</span>
                  <span className="text-base font-light text-[#E8C58D]">pts</span>
                </div>
                <span className="text-[11px] text-white/70 font-mono mt-0.5">
                  1 pt earned per ₹10 spent
                </span>

                <button
                  disabled={claiming || !canClaimBonus}
                  onClick={handleClaimPoints}
                  className={`mt-3.5 px-4 py-2 rounded-full font-semibold text-xs tracking-wider uppercase transition flex items-center gap-1.5 shadow-md active:scale-95 ${
                    canClaimBonus
                      ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:brightness-110 text-white cursor-pointer"
                      : "bg-white/20 text-white/70 cursor-not-allowed opacity-80"
                  }`}
                >
                  <Zap size={13} fill="currentColor" />
                  <span>
                    {claiming
                      ? "Claiming..."
                      : canClaimBonus
                      ? "Claim +50 Free Points"
                      : `Claimed (${nextClaimInHours}h Cooldown)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Coupon Vault (Main Focus: Ticket-Style Coupons) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Section Title & Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#D4B483]/20 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
              <Tag size={14} />
              <span>Coupon Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-medium mt-1">
              Active Member Coupons
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Click "Copy Code" and paste during checkout for instant savings.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[#D4B483]/30">
            {[
              { id: "all", label: "All Coupons" },
              { id: "flat", label: "Flat ₹ OFF" },
              { id: "percent", label: "Percentage %" },
              { id: "shipping", label: "Free Shipping" },
              { id: "vip", label: "VIP Vault" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 ${
                  activeFilter === tab.id
                    ? "bg-[#6D1830] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#D4B483]/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Grid: Ticket-Voucher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.id}
                className="
                  relative
                  rounded-2xl
                  border border-[#D4B483]/35
                  bg-[var(--card-bg)]
                  shadow-md
                  hover:shadow-xl
                  hover:border-[#8C2F4D]
                  transition-all duration-300
                  flex flex-col justify-between
                  overflow-hidden
                  group
                "
              >
                {/* Popular Ribbon / Tag */}
                <div className="p-5 pb-4 border-b border-dashed border-[#D4B483]/30 relative">
                  {/* Perforated ticket circles (left & right) */}
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[var(--bg-primary)] border-r border-[#D4B483]/40" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[var(--bg-primary)] border-l border-[#D4B483]/40" />

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${coupon.badgeColor}`}>
                      {coupon.badge}
                    </span>
                    {coupon.popular && (
                      <span className="flex items-center gap-1 text-[11px] text-[#B8860B] font-semibold">
                        <Flame size={13} className="fill-[#B8860B]" />
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Discount Value */}
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2F4D] dark:text-[#E8C58D] mt-1">
                    {coupon.discount}
                  </div>

                  <h3 className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                    {coupon.title}
                  </h3>

                  <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
                    {coupon.minOrder}
                  </p>
                </div>

                {/* Bottom Code & Action */}
                <div className="p-5 pt-4 bg-[var(--bg-secondary)]/50 flex flex-col justify-between flex-1">
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3">
                    {coupon.description}
                  </p>

                  <div className="space-y-2 mt-auto">
                    {/* Code Display */}
                    <div className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-dashed border-[#D4B483]/60 flex items-center justify-between text-xs font-mono font-bold text-[var(--text-primary)]">
                      <span>{coupon.code}</span>
                      {isCopied ? (
                        <span className="text-[11px] text-emerald-600 font-sans font-semibold flex items-center gap-1">
                          <Check size={13} /> Copied
                        </span>
                      ) : (
                        <Copy size={13} className="text-[var(--text-muted)] group-hover:text-[#8C2F4D] transition-colors" />
                      )}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`
                        w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm
                        ${
                          isCopied
                            ? "bg-emerald-700 text-white"
                            : "bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-white hover:brightness-110 active:scale-98"
                        }
                      `}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} /> Code Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Code
                        </>
                      )}
                    </button>

                    {/* Quick Link to Checkout */}
                    <Link
                      to="/checkout"
                      className="block text-center text-[11px] font-semibold text-[var(--text-muted)] hover:text-[#8C2F4D] dark:hover:text-[#E8C58D] transition-colors pt-1"
                    >
                      Apply at Checkout →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Privilege Club Tiers (Clean, 3 Simple Levels) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
            Privilege Levels
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[var(--text-primary)] font-medium mt-1">
            Privilege Club Tiers
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-lg mx-auto">
            Transparent perks: 1 point = ₹5 redemption, 2x earning in VIP Royal, and Free Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GLAM_TIERS.map((tier) => {
            const isUserTier = currentTierName === tier.name;

            return (
              <div
                key={tier.id}
                className={`
                  relative
                  rounded-3xl
                  p-6 sm:p-7
                  border
                  ${tier.popular ? "border-[#B8860B] ring-2 ring-[#B8860B]/30" : "border-[#D4B483]/35"}
                  bg-gradient-to-b ${tier.cardGradient}
                  shadow-lg
                  hover:-translate-y-1.5
                  transition-all duration-300
                  flex flex-col justify-between
                `}
              >
                {/* Popular Pill */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white text-[10px] font-semibold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${tier.badgeStyle}`}>
                      {tier.name}
                    </span>
                    {isUserTier && (
                      <span className="text-xs font-semibold text-[#8C2F4D] dark:text-[#E8C58D] flex items-center gap-1">
                        <Check size={14} /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-medium text-[var(--text-primary)]">
                    {tier.tagline}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    {tier.subtitle}
                  </p>

                  <div className="my-5 h-px bg-[#D4B483]/25" />

                  {/* Bullet perks */}
                  <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#B8860B] mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#D4B483]/20">
                  <Link
                    to="/products"
                    className="w-full py-2.5 rounded-xl border border-[#D4B483]/60 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] hover:border-[#8C2F4D] hover:bg-[#8C2F4D] hover:text-white transition duration-200 block text-center shadow-sm"
                  >
                    Shop Saree Collection
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Simple 3 Steps: How Club Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-10">
          <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
            Zero Hassle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-medium mt-1">
            How The Club Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 text-center hover:border-[#8C2F4D] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D4B483]/15 border border-[#D4B483]/30 flex items-center justify-center text-[#8C2F4D] dark:text-[#E8C58D] mb-4">
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-mono text-[#B8860B] font-bold tracking-wider">
                  STEP {item.step}
                </span>
                <h3 className="text-base font-serif font-medium text-[var(--text-primary)] mt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Short Essential FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
            Common Questions
          </span>
          <h2 className="text-2xl font-serif text-[var(--text-primary)] font-medium mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {SIMPLE_FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#D4B483]/30 bg-[var(--card-bg)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-medium text-[var(--text-primary)] hover:text-[#8C2F4D] dark:hover:text-[#E8C58D]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[#D4B483]/15">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-[#6D1830] via-[#8C2F4D] to-[#6D1830] text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-medium">
              Ready to Drape in Luxury?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto">
              Copy any active coupon above and shop our bridal, festive, and designer sarees.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E8C58D] to-[#D4B483] text-[#6D1830] font-bold text-xs uppercase tracking-widest hover:brightness-105 transition shadow-md"
              >
                <span>Shop Sarees Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Loyalty;