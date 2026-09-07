import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
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
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

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

  const total = cart.reduce(
    (sum, item) => sum + item.priceINR * item.quantity,
    0
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

    // Fetch user's saved addresses
    fetchAddresses();
  }, [user, cart]);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      // 1. Create order on backend
      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: total }),
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
        description: `Order Payment of ₹${total}`,
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
            // 3. Verify payment on backend
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
                subtotal: total,
                totalAmount: total,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              toast.success("Payment successful! Order placed.");
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

  // =====================================
  // CASH ON DELIVERY (COD) FLOW
  // =====================================
  const handleCODPayment = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payment/cod-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: formattedItems,
          shippingAddress: formData,
          subtotal: total,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate("/profile");
      } else {
        toast.error(data.message || "Failed to place COD order");
      }
    } catch (err) {
      console.error("COD error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "Razorpay") {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Back Link */}
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#8B1E3F] mb-8 font-medium transition"
        >
          <ArrowLeft size={16} /> Back to Shopping Cart
        </button>

        <h1 className="text-3xl md:text-4xl font-serif text-[#2C1810] mb-8">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              {/* Saved Address Selector */}
              {savedAddresses.length > 1 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House number, street, landmark"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment or area"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Postal Code / PIN *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    disabled
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  onClick={() => setPaymentMethod("Razorpay")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "Razorpay"
                      ? "border-[#8B1E3F] bg-[#8B1E3F]/5 ring-1 ring-[#8B1E3F]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                    className="mt-1 text-[#8B1E3F] focus:ring-[#8B1E3F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard size={18} className="text-[#8B1E3F]" />
                        Razorpay Secure Gateway
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), NetBanking & Wallets.
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#8B1E3F] bg-[#8B1E3F]/5 ring-1 ring-[#8B1E3F]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 text-[#8B1E3F] focus:ring-[#8B1E3F]"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck size={18} className="text-gray-700" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay in cash upon doorstep delivery of your order.
                    </p>
                  </div>
                </label>
              </div>

              {/* Security Banner */}
              <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                <span>256-bit SSL encrypted. Your payment details are protected with bank-grade security.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary ({cart.length} {cart.length === 1 ? "item" : "items"})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item._id} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#8B1E3F] mt-1">
                        ₹{item.priceINR * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-6 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#8B1E3F]">₹{total}</span>
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
                  `Pay ₹${total} via Razorpay`
                ) : (
                  `Place Order (COD) • ₹${total}`
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>100% Genuine Handloom Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
