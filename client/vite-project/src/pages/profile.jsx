import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Gift, LogOut, Package, Crown, Plus, CheckCircle2, ChevronRight, X, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLoyalty } from "../context/LoyaltyContext";
import { API_BASE } from "../services/apiConfig.js";
import orderApi from "../services/orderApi";
import toast from "react-hot-toast";

const ShippingTracker = ({ status }) => {
  const steps = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(status);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = index <= currentStep;
          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                  completed
                    ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-sm"
                    : "bg-gray-100 dark:bg-[#201426] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-[#38283E]"
                }`}
              >
                {completed ? <CheckCircle2 size={15} /> : index + 1}
              </div>
              <p
                className={`text-[10px] sm:text-xs mt-2 text-center ${
                  completed
                    ? "text-[#6D1830] dark:text-[#E5C583] font-semibold"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 bg-gray-100 dark:bg-[#201426] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6D1830] dark:bg-[#E5C583] transition-all duration-500"
          style={{
            width: currentStep < 0 ? "0%" : `${(currentStep / 4) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, logout } = useAuth();
  const { points, tier } = useLoyalty();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhone, setNewPhone] = useState(user?.phone || "");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login?mode=signup");
      return;
    }
    setNewName(user?.name || "");
    setNewPhone(user?.phone || "");
    fetchAddresses();
    fetchMyOrders();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.log("Could not load addresses:", err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.log("MY ORDERS ERROR:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully!");
      setEditing(false);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save address");

      toast.success("Address added successfully!");
      setShowAddressModal(false);
      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
      await fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Could not save address");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#120B15] text-[var(--text-primary)] transition-colors duration-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#2C1F32] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6D1830] to-[#8C2F4D] dark:from-[#26152B] dark:to-[#431F4A] border-2 border-[#D4B483] text-white text-2xl font-serif font-bold flex items-center justify-center shadow-md">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF]">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] uppercase tracking-wider font-semibold">
                  {tier?.name || "Clan Insider"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <Mail size={13} />
                <span>{user?.email}</span>
              </p>
              {user?.phone && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <Phone size={13} />
                  <span>+91 {user.phone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setNewName(user?.name || "");
                setNewPhone(user?.phone || "");
                setEditing(true);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#38283E] text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#201426] transition cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 hover:bg-red-100 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Loyalty / Clan Pass */}
          <Link
            to="/loyalty"
            className="group bg-gradient-to-br from-[#FAF5EF] to-amber-50/50 dark:from-[#1D1322] dark:to-[#2A1629] p-6 rounded-2xl border border-[#D4B483]/40 shadow-sm hover:shadow-md transition block"
          >
            <div className="flex justify-between items-start">
              <Gift size={26} className="text-[#8B1E3F] dark:text-[#E5C583]" />
              <span className="text-[10px] uppercase tracking-widest text-[#8B1E3F] dark:text-[#E5C583] font-semibold flex items-center gap-1">
                <span>View Club</span>
                <ChevronRight size={12} />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#8B1E3F] dark:text-[#E5C583] mt-3">
              {points || user?.loyaltyPoints || 0} <span className="text-sm font-normal">pts</span>
            </p>
            <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mt-1">
              Clan Points & Coupons
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              10 pts = ₹5 checkout discount
            </p>
          </Link>

          {/* Saved Addresses */}
          <div className="bg-white dark:bg-[#18101C] p-6 rounded-2xl border border-gray-100 dark:border-[#2C1F32] shadow-sm">
            <div className="flex justify-between items-start">
              <MapPin size={26} className="text-[#8B1E3F] dark:text-[#E5C583]" />
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="text-[11px] font-semibold text-[#8B1E3F] dark:text-[#E5C583] hover:underline flex items-center gap-0.5"
              >
                <Plus size={13} /> Add New
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] mt-3">
              {addresses.length}
            </p>
            <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mt-1">
              Saved Addresses
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Default shipping locations
            </p>
          </div>

          {/* Orders Count */}
          <div className="bg-white dark:bg-[#18101C] p-6 rounded-2xl border border-gray-100 dark:border-[#2C1F32] shadow-sm">
            <Package size={26} className="text-[#8B1E3F] dark:text-[#E5C583]" />
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] mt-3">
              {orders.length}
            </p>
            <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mt-1">
              My Orders
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Track delivery & invoices
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#2C1F32] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF]">
              Order History
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>

          {ordersLoading ? (
            <p className="text-xs text-gray-500 text-center py-10">
              Loading your orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                You haven't placed any orders yet.
              </p>
              <Link
                to="/products"
                className="mt-4 inline-block px-5 py-2 rounded-full bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition"
              >
                Shop Sarees
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-100 dark:border-[#2C1F32] rounded-2xl p-5 sm:p-6 bg-gray-50/50 dark:bg-[#1A111E]"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200/60 dark:border-[#2C1F32]">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Order Ref</span>
                      <p className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-lg font-bold text-[#8B1E3F] dark:text-[#E5C583]">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </p>
                      <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="py-4 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image || "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179793/product8.1_w6x0lq.png"}
                          alt={item.name}
                          className="w-14 h-16 rounded-xl object-cover border border-gray-200 dark:border-[#38283E]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Applied Perks Badges */}
                  {(order.couponCode || order.pointsEarned > 0) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200/60 dark:border-[#2C1F32] text-[11px]">
                      {order.couponCode && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                          🎟️ Coupon: {order.couponCode}
                        </span>
                      )}
                      {order.pointsEarned > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          👑 +{order.pointsEarned} Clan Points Earned
                        </span>
                      )}
                    </div>
                  )}

                  {/* Shipping Tracker */}
                  <div className="pt-4 border-t border-gray-200/60 dark:border-[#2C1F32]">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Tracking Progress
                    </span>
                    <ShippingTracker status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Addresses List */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#2C1F32] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF]">
              Saved Addresses
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-1.5 rounded-full bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold tracking-wider transition flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-xs text-gray-500 py-4">No addresses saved yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-[#2C1F32] rounded-2xl p-4 bg-gray-50/50 dark:bg-[#1A111E]"
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {addr.fullName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{addr.phone}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {addr.addressLine1} {addr.addressLine2}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18101C] border border-[#D4B483]/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">
              Edit Your Profile
            </h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Mobile Number (+91)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-700 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full pl-14 pr-3 py-3 border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateProfile}
                className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18101C] border border-[#D4B483]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                Add New Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addAddress} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={addressForm.fullName}
                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
              />
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
              />
              <input
                type="text"
                placeholder="Address (House / Flat / Street) *"
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City *"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                />
              </div>
              <input
                type="text"
                placeholder="PIN Code *"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-gray-50 dark:bg-[#201426] text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
              />

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;