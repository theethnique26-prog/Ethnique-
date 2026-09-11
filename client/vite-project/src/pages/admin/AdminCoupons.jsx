import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Percent,
  Gift,
  Truck,
  RefreshCw,
} from "lucide-react";
import { API_BASE } from "../../services/apiConfig";
import toast from "react-hot-toast";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Coupon Form
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "flat", // 'flat' | 'percentage' | 'shipping'
    discountValue: 2498,
    minOrderAmount: 4999,
    maxDiscount: "",
    badge: "Special Offer",
    popular: true,
    requiredTier: "all",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/coupons/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      } else {
        // Fallback to public endpoint if admin route isn't authenticated yet
        const pubRes = await fetch(`${API_BASE}/coupons`);
        const pubData = await pubRes.json();
        if (pubData.success) setCoupons(pubData.coupons);
      }
    } catch (err) {
      console.error("Fetch coupons error:", err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.title || !formData.discountValue) {
      toast.error("Please fill in code, title, and discount value");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          code: formData.code.trim().toUpperCase(),
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Coupon ${formData.code.toUpperCase()} created successfully!`);
        setShowModal(false);
        setFormData({
          code: "",
          title: "",
          description: "",
          discountType: "flat",
          discountValue: "",
          minOrderAmount: 0,
          maxDiscount: "",
          badge: "Special Offer",
          popular: false,
          requiredTier: "all",
        });
        fetchCoupons();
      } else {
        toast.error(data.message || "Failed to create coupon");
      }
    } catch (err) {
      console.error("Create coupon error:", err);
      toast.error("Network error while creating coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/coupons/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon status updated`);
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error toggling coupon");
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon ${code} deleted`);
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting coupon");
    }
  };

  const quickCreate2498 = () => {
    setFormData({
      code: "ETHNIQUE2498",
      title: "Grand Royal Celebration ₹2,498 Voucher",
      description: "Flat ₹2,498 instant discount on designer bridal and festive drapes above ₹4,999.",
      discountType: "flat",
      discountValue: 2498,
      minOrderAmount: 4999,
      maxDiscount: "",
      badge: "Special ₹2,498 OFF",
      popular: true,
      requiredTier: "all",
    });
    setShowModal(true);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.badge && c.badge.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#8B1E3F]/10 text-[#8B1E3F] dark:text-[#E5C583]">
              <Tag size={20} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
              Coupon Management
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Create, monitor, and manage checkout discount codes and VIP vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={quickCreate2498}
            className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles size={14} />
            Preset: ₹2,498 Coupon
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-[#6D1830] hover:bg-[#571225] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Plus size={16} />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by coupon code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#18101C] border border-gray-200 dark:border-[#2C1F32] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
          />
        </div>

        <button
          onClick={fetchCoupons}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#18101C] rounded-3xl shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 dark:bg-[#120B15] text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Title & Details</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Badge</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2C1F32]">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Loading coupons...
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No coupons found matching your search.
                </td>
              </tr>
            ) : (
              filteredCoupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-[#201426]/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-[#FAF5EF] bg-gray-100 dark:bg-[#25152A] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#38283E]">
                        {c.code}
                      </span>
                      {c.popular && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-medium text-gray-900 dark:text-[#FAF5EF] line-clamp-1">{c.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{c.description || "—"}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-[#8B1E3F] dark:text-[#E5C583]">
                      {c.discountType === "shipping"
                        ? "FREE SHIP"
                        : c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue.toLocaleString("en-IN")} OFF`}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600 dark:text-gray-300">
                    ₹{(c.minOrderAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {c.badge || "Standard"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(c._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                        c.isActive
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}
                    >
                      {c.isActive ? (
                        <>
                          <CheckCircle2 size={12} /> Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c._id, c.code)}
                      title="Delete coupon"
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18101C] border border-gray-200 dark:border-[#2C1F32] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 dark:border-[#2C1F32] flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <Tag size={18} className="text-[#8B1E3F]" />
                Create New Coupon
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ETHNIQUE2498"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Festive ₹2,498 OFF"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Valid on all pure silk sarees"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Value {formData.discountType === "percentage" ? "(%)" : "(₹)"} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded text-[#8B1E3F] focus:ring-[#8B1E3F]"
                    />
                    Mark as Popular / Featured
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#2C1F32]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#6D1830] hover:bg-[#571225] text-white transition disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;
