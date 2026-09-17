import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLoyalty } from "../context/LoyaltyContext";
import { API_BASE } from "../services/apiConfig";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Gift,
  Sparkles,
  X,
  Crown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const { points, tier, refreshLoyalty } = useLoyalty();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);

  // Club Points Redemption state
  const [redeemClanPoints, setRedeemClanPoints] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceINR * item.quantity,
    0
  );

  // Calculate Club Points redemption discount (1 pt = ₹5, max 50% of subtotal)
  const maxAllowedPoints = Math.min(
    points || 0,
    Math.floor((subtotal * 0.5) / 5)
  );
  const pointsToUse = redeemClanPoints ? maxAllowedPoints : 0;
  const clanPointsDiscount = Math.round(pointsToUse * 5);

  // Calculate Coupon discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Free shipping check (min subtotal 999 or FREESHIP coupon or Elite tier)
  const isFreeShipping =
    subtotal >= 999 ||
    appliedCoupon?.freeShipping ||
    tier?.freeShippingAlways ||
    false;
  const shippingCharge = isFreeShipping ? 0 : 99;

  // Total discounts and final total
  const totalDiscount = couponDiscount + clanPointsDiscount;
  const finalTotal = Math.max(0, subtotal - totalDiscount + shippingCharge);

  // Club points earned on this order: Standard 10%, Elite 15%, VIP Royal (1500+) 2x (20%)
  const isVipTier =
    (points || 0) >= 1500 ||
    tier?.name?.toLowerCase().includes("royal") ||
    tier?.level === 3;
  const earnRate = isVipTier ? 0.2 : (points || 0) >= 500 ? 0.15 : 0.1;
  const pointsEarned = Math.max(
    0,
    Math.floor((subtotal - totalDiscount) * earnRate)
  );

  useEffect(() => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    fetchAddresses();
    fetchCoupons();
  }, [user, cart]);

  // Fetch available coupons from backend
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE}/coupons`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.coupons)) {
          setAvailableCoupons(data.coupons);
        }
      }
    } catch (err) {
      console.log("Could not load coupons:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE}/address`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSavedAddresses(data);
        const primary = data[0];
        setFormData({
          fullName: primary.fullName || user?.name || "",
          phone: primary.phone || "",
          addressLine1: primary.addressLine1 || "",
          addressLine2: primary.addressLine2 || "",
          city: primary.city || "",
          state: primary.state || "",
          pincode: primary.pincode || "",
          country: primary.country || "India",
        });
      }
    } catch (err) {
      console.log("Could not load addresses:", err);
    }
  };

  const lookupPincode = async (pin) => {
    if (!/^\d{6}$/.test(pin)) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Circle || po.Name || "";
          const detectedState = po.State || "";
          setFormData((prev) => ({
            ...prev,
            city: detectedCity,
            state: detectedState,
          }));
          toast.success(`Location detected: ${detectedCity}, ${detectedState}`);
        }
      }
    } catch (err) {
      console.warn("Pincode lookup error:", err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pincode") {
      const cleanPin = value.replace(/\D/g, "");
      if (cleanPin.length === 6) {
        lookupPincode(cleanPin);
      }
    }
  };

  const validateAddress = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill in all required shipping address fields");
      return false;
    }
    return true;
  };

  // =====================================
  // APPLY COUPON HANDLER
  // =====================================
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponValidating(true);
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code,
          subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponInput(data.coupon.code);
        setShowCouponsModal(false);
        toast.success(data.coupon.message, {
          icon: "🎟️",
          duration: 3500,
        });
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      toast.error("Network error while validating coupon");
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast("Coupon removed");
  };

  const formattedItems = cart.map((item) => ({
    product: item._id,
    name: item.name,
    image: item.images?.[0] || "",
    price: item.priceINR,
    quantity: item.quantity,
  }));

  // =====================================
  // RAZORPAY PAYMENT FLOW
  // =====================================
  const handleRazorpayPayment = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your network.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on backend with calculated finalTotal
      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // 2. Open Razorpay modal
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "Ethnique by Jayant",
        description: `Order Payment of ₹${finalTotal}`,
        order_id: data.order.id,
        prefill: {
          name: formData.fullName,
          email: user?.email || "",
          contact: formData.phone,
        },
        theme: {
          color: "#8B1E3F",
        },
        handler: async function (response) {
          try {
            // 3. Verify payment on backend with coupon & points tracking
            const verifyRes = await fetch(`${API_BASE}/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: formattedItems,
                shippingAddress: formData,
                subtotal,
                shippingCharge,
                discount: totalDiscount,
                couponCode: appliedCoupon?.code || "",
                pointsRedeemed: pointsToUse,
                totalAmount: finalTotal,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              if (refreshLoyalty) refreshLoyalty();
              toast.success(
                `Payment successful! You earned +${pointsEarned} Club Points!`
              );
              navigate("/profile");
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Error during payment verification");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message || "Unable to proceed with Razorpay");
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    handleRazorpayPayment();
  };

  return (
    <div className="bg-[#FAF7F5] dark:bg-[#120B15] min-h-screen py-10 px-4 md:px-8 transition-colors duration-400">
      <div className="max-w-6xl mx-auto">
        {/* Top Back Link */}
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#8B1E3F] dark:hover:text-[#E5C583] mb-8 font-medium transition"
        >
          <ArrowLeft size={16} /> Back to Shopping Cart
        </button>

        <h1 className="text-3xl md:text-4xl font-serif text-[#2C1810] dark:text-[#FAF5EF] mb-8">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-[#2C1F32]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 dark:bg-[#E5C583]/10 text-[#8B1E3F] dark:text-[#E5C583] flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-[#FAF5EF]">
                  Shipping Address
                </h2>
              </div>

              {/* Saved Address Selector */}
              {savedAddresses.length > 1 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Use a saved address
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = savedAddresses.find(
                        (a) => a._id === e.target.value
                      );
                      if (selected) {
                        setFormData({
                          fullName: selected.fullName || "",
                          phone: selected.phone || "",
                          addressLine1: selected.addressLine1 || "",
                          addressLine2: selected.addressLine2 || "",
                          city: selected.city || "",
                          state: selected.state || "",
                          pincode: selected.pincode || "",
                          country: selected.country || "India",
                        });
                      }
                    }}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.fullName} - {addr.addressLine1}, {addr.city} ({addr.pincode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's name"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House number, street, landmark"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment or area"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Postal Code / PIN *
                    </label>
                    {pincodeLoading && (
                      <span className="text-[11px] text-[#8B1E3F] dark:text-[#E5C583] flex items-center gap-1 font-medium">
                        <Loader2 size={12} className="animate-spin" /> Detecting...
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit PIN code"
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">City & State will auto-fill on 6-digit PIN</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    disabled
                    className="w-full bg-gray-50 dark:bg-[#1a111e] border border-gray-200 dark:border-[#38283E] rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-[#2C1F32]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 dark:bg-[#E5C583]/10 text-[#8B1E3F] dark:text-[#E5C583] flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-[#FAF5EF]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Razorpay Online Payment Option */}
                <div
                  className="flex items-start gap-4 p-5 rounded-2xl border border-[#8B1E3F] dark:border-[#E5C583] bg-[#8B1E3F]/5 dark:bg-[#E5C583]/10 ring-1 ring-[#8B1E3F] dark:ring-[#E5C583] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[#8B1E3F] dark:bg-[#E5C583] flex items-center justify-center text-white dark:text-black mt-0.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                        <CreditCard size={18} className="text-[#8B1E3F] dark:text-[#E5C583]" />
                        Razorpay 100% Secure Online Payment
                      </span>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full">
                        Prepaid Only
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                      Instant &amp; Insured payment via UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking &amp; Wallets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#201426] p-3 rounded-xl border border-gray-100 dark:border-[#38283E]">
                <ShieldCheck size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>256-bit SSL encrypted. Your payment details are protected with bank-grade security.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary, Coupons & Clan Points */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-[#2C1F32]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[#FAF5EF] mb-5">
                Order Summary ({cart.length} {cart.length === 1 ? "item" : "items"})
              </h2>

              {/* Items List */}
              <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-[#2C1F32]">
                {cart.map((item) => (
                  <div key={item._id} className="pt-3.5 first:pt-0 flex gap-3.5 items-center">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-14 h-18 object-cover rounded-xl border border-gray-100 dark:border-[#38283E] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-[#FAF5EF] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#8B1E3F] dark:text-[#E5C583] mt-1">
                        ₹{item.priceINR * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================================================= */}
              {/* COUPON & PROMO CODE SECTION */}
              {/* ================================================= */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2C1F32]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Tag size={14} className="text-[#8B1E3F] dark:text-[#E5C583]" />
                    <span>Apply Coupon</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCouponsModal(true)}
                    className="text-xs font-semibold text-[#8B1E3F] dark:text-[#E5C583] hover:underline"
                  >
                    View All Coupons
                  </button>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          {appliedCoupon.freeShipping
                            ? "Standard Delivery unlocked"
                            : `₹${appliedCoupon.discountAmount} discount applied`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-[#201426] transition"
                      title="Remove Coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="e.g. JAYANT10, GLAMCLAN15"
                      className="flex-1 border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-gray-100 uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                    />
                    <button
                      type="button"
                      disabled={couponValidating || !couponInput.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
                    >
                      {couponValidating ? "Checking..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* ================================================= */}
              {/* CLUB POINTS REDEMPTION BOX */}
              {/* ================================================= */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2C1F32]">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/40 dark:border-amber-600/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Gift size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-900 dark:text-[#FAF5EF]">
                          Redeem Club Points
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-medium">
                          {points || 0} pts available
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {points > 0
                          ? `Use ${maxAllowedPoints} pts for instant ₹${Math.round(maxAllowedPoints * 5)} OFF (1 pt = ₹5)`
                          : "Earn 1 pt per ₹10 spent (2x VIP Royal)"}
                      </p>
                    </div>
                  </div>

                  {points > 0 && (
                    <button
                      type="button"
                      onClick={() => setRedeemClanPoints(!redeemClanPoints)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        redeemClanPoints
                          ? "bg-amber-600 text-white"
                          : "border border-amber-500 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10"
                      }`}
                    >
                      {redeemClanPoints ? "Applied" : "Redeem"}
                    </button>
                  )}
                </div>
              </div>

              {/* ================================================= */}
              {/* ITEMIZED PRICE BREAKDOWN */}
              {/* ================================================= */}
              <div className="border-t border-gray-100 dark:border-[#2C1F32] mt-5 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-[#FAF5EF]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {redeemClanPoints && clanPointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                    <span>Club Points Discount ({pointsToUse} pts)</span>
                    <span>-₹{clanPointsDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Insured Standard Delivery</span>
                  <span className={shippingCharge === 0 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "font-medium"}>
                    {shippingCharge === 0 ? "Standard Delivery (₹0)" : `₹${shippingCharge}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 dark:border-[#2C1F32] pt-3.5 flex justify-between text-lg font-semibold text-gray-900 dark:text-[#FAF5EF]">
                  <span>Total Amount</span>
                  <span className="text-[#8B1E3F] dark:text-[#E5C583]">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>

                {/* Points to earn badge */}
                <div className="pt-2">
                  <div className="bg-[#8B1E3F]/5 dark:bg-[#E5C583]/10 border border-[#8B1E3F]/15 dark:border-[#E5C583]/20 rounded-xl p-2.5 text-center text-xs text-[#8B1E3F] dark:text-[#E5C583] flex items-center justify-center gap-1.5 font-medium">
                    <Sparkles size={14} />
                    <span>You will earn +{pointsEarned} Club Points with this order</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                onClick={handlePlaceOrder}
                className="
                  w-full
                  mt-6
                  bg-[#8B1E3F]
                  hover:bg-[#721833]
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  text-base
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  disabled:opacity-50
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : paymentMethod === "Razorpay" ? (
                  `Pay ₹${finalTotal.toLocaleString("en-IN")} via Razorpay`
                ) : (
                  `Place Order (COD) • ₹${finalTotal.toLocaleString("en-IN")}`
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>100% Genuine Quality Guarantee • Jayant Saree Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* VIEW ALL COUPONS MODAL / DRAWER */}
      {/* ================================================= */}
      {showCouponsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCouponsModal(false)}
        >
          <div
            className="bg-white dark:bg-[#18101C] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-[#D4B483]/50 shadow-2xl flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-[#2C1F32] flex justify-between items-center bg-[#FAF6F0] dark:bg-[#201426]">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B1E3F] dark:text-[#E5C583] uppercase tracking-wider">
                  <Tag size={14} />
                  <span>Member Coupon Hub</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mt-1">
                  Active Member Coupons
                </h3>
              </div>
              <button
                onClick={() => setShowCouponsModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Coupons List */}
            <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-gray-100 dark:divide-[#2C1F32]">
              {availableCoupons.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  Loading active coupons...
                </p>
              ) : (
                availableCoupons.map((c) => {
                  const eligible = subtotal >= c.minOrderAmount;
                  const isCurrent = appliedCoupon?.code === c.code;

                  return (
                    <div
                      key={c._id || c.code}
                      className="pt-3.5 first:pt-0 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#8B1E3F] dark:text-[#E5C583] bg-[#8B1E3F]/10 dark:bg-[#E5C583]/10 px-2.5 py-0.5 rounded-md border border-[#8B1E3F]/20 dark:border-[#E5C583]/30">
                              {c.code}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                              {c.badge || "Special"}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                            {c.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {c.description}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                            Min. order: ₹{c.minOrderAmount.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={!eligible || isCurrent}
                          onClick={() => handleApplyCoupon(c.code)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition ${
                            isCurrent
                              ? "bg-emerald-600 text-white cursor-default"
                              : eligible
                              ? "bg-[#8B1E3F] hover:bg-[#721833] text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isCurrent ? "Applied" : eligible ? "Apply" : "Locked"}
                        </button>
                      </div>

                      {!eligible && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Add ₹{(c.minOrderAmount - subtotal).toLocaleString("en-IN")} more to your cart to unlock this coupon.
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-[#201426] border-t border-gray-100 dark:border-[#2C1F32] flex justify-between items-center text-xs text-gray-500">
              <Link
                to="/loyalty"
                className="text-[#8B1E3F] dark:text-[#E5C583] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Privilege Rewards Rules</span>
                <ChevronRight size={13} />
              </Link>
              <button
                onClick={() => setShowCouponsModal(false)}
                className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
