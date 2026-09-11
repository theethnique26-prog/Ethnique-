import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  RefreshCw,
  MapPin,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "../../services/apiConfig";
import toast from "react-hot-toast";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Review Form
  const [formData, setFormData] = useState({
    name: "",
    location: "Varanasi, UP",
    occasion: "Bridal Trousseau",
    rating: 5,
    short: "",
    full: "",
    featured: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        const pubRes = await fetch(`${API_BASE}/reviews`);
        const pubData = await pubRes.json();
        if (pubData.success) setReviews(pubData.reviews);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.short) {
      toast.error("Customer name and short testimonial are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating) || 5,
          full: formData.full || formData.short,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Customer review added successfully!");
        setShowModal(false);
        setFormData({
          name: "",
          location: "Varanasi, UP",
          occasion: "Bridal Trousseau",
          rating: 5,
          short: "",
          full: "",
          featured: true,
        });
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to add review");
      }
    } catch (err) {
      console.error("Create review error:", err);
      toast.error("Network error while adding review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review visibility updated");
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: !r.isActive } : r))
        );
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (err) {
      toast.error("Error toggling review");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (err) {
      toast.error("Error deleting review");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.location && r.location.toLowerCase().includes(search.toLowerCase())) ||
      (r.occasion && r.occasion.toLowerCase().includes(search.toLowerCase())) ||
      (r.short && r.short.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#8B1E3F]/10 text-[#8B1E3F] dark:text-[#E5C583]">
              <MessageSquare size={20} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
              Customer Reviews
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage authentic customer stories shown on the homepage testimonial slider.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#6D1830] hover:bg-[#571225] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={16} />
          Add Review
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, city, or quote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#18101C] border border-gray-200 dark:border-[#2C1F32] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
          />
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            No customer reviews found.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-[#18101C] border border-gray-200 dark:border-[#2C1F32] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#8B1E3F]/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < (r.rating || 5) ? "currentColor" : "none"}
                        className={i < (r.rating || 5) ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {r.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#8B1E3F]/10 text-[#8B1E3F] dark:text-[#E5C583] font-semibold">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={() => handleToggle(r._id)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition ${
                        r.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                      }`}
                    >
                      {r.isActive ? "Active" : "Hidden"}
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-semibold text-gray-900 dark:text-[#FAF5EF] text-base">
                  {r.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {r.location || "India"}
                  </span>
                  <span>&bull;</span>
                  <span>{r.occasion || "Customer Review"}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3 mb-4">
                  "{r.short || r.full}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-[#2C1F32] flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleDelete(r._id, r.name)}
                  title="Delete review"
                  className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD REVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18101C] border border-gray-200 dark:border-[#2C1F32] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 dark:border-[#2C1F32] flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <MessageSquare size={18} className="text-[#8B1E3F]" />
                Add Customer Review
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kolkata, WB"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Occasion / Saree Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding Reception"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Highlight Quote / Short Review *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The drape felt like heirloom poetry. Pure zari weave was breathtaking."
                  value={formData.short}
                  onChange={(e) => setFormData({ ...formData, short: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Testimonial Details (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed customer experience or feedback..."
                  value={formData.full}
                  onChange={(e) => setFormData({ ...formData, full: e.target.value })}
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredReview"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-[#8B1E3F] focus:ring-[#8B1E3F]"
                />
                <label htmlFor="featuredReview" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Feature prominently on homepage slider
                </label>
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
                  {submitting ? "Adding..." : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviews;
