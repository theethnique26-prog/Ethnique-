import { useEffect, useState, useMemo } from "react";
import adminApi from "../../services/adminApi";
import { API_BASE } from "../../services/apiConfig.js";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
  IndianRupee,
  LayoutGrid,
  Table as TableIcon,
  Upload,
  RefreshCw,
  Star,
  Image as ImageIcon,
} from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [editingStockState, setEditingStockState] = useState({});
  const [savingStockId, setSavingStockId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [manualPhotoUrl, setManualPhotoUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    highlight: "",
    fabric: "",
    color: "",
    sareeLength: "5.5 Meters",
    blouse: "0.8 Meter Unstitched",
    collection: "Festive Collection",
    category: "Cotton Saree",
    priceINR: "",
    stock: "",
    inStock: true,
    image: "",
    video: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.get("/products");
      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      sku: `ETH-SAR-${String(Math.floor(100 + Math.random() * 900))}`,
      description: "Handcrafted designer saree from Jayant Saree Center • Ethnique, featuring intricate zari weaving and pure drape comfort.",
      highlight: "Pure Zari Weave • Heritage Edit",
      fabric: "Chanderi Silk Blend",
      color: "Heritage Red",
      sareeLength: "5.5 Meters",
      blouse: "0.8 Meter Running",
      collection: "Festive Collection",
      category: "Cotton Saree",
      priceINR: "2499",
      stock: "25",
      inStock: true,
      image: "",
      images: [],
      video: "",
    });
    setShowForm(true);
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    const stockVal = product.stock ?? 0;
    const isCurrentlyInStock = product.inStock !== false && Number(stockVal) > 0;
    const productImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : (product.images?.[0] ? [product.images[0]] : (product.image ? [product.image] : []));

    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      description: product.description || "",
      highlight: product.highlight || "",
      fabric: product.fabric || "",
      color: product.color || "",
      sareeLength: product.sareeLength || "5.5 Meters",
      blouse: product.blouse || "0.8 Meter",
      collection: product.collection || "Signature Weave",
      category: product.category || "Cotton Saree",
      priceINR: product.priceINR || "",
      stock: stockVal,
      inStock: isCurrentlyInStock,
      image: productImages[0] || "",
      images: productImages,
      video: product.video || "",
    });
    setShowForm(true);
  };

  // Update exact stock amount entered by admin
  const handleUpdateStockAmount = async (product, amount) => {
    const parsed = parseInt(amount, 10);
    const stockVal = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const nextInStock = stockVal > 0;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id
          ? {
              ...p,
              stock: stockVal,
              inStock: nextInStock,
            }
          : p
      )
    );

    // Clear local editing state for this product
    setEditingStockState((prev) => {
      const copy = { ...prev };
      delete copy[product._id];
      return copy;
    });

    try {
      setSavingStockId(product._id);
      const res = await adminApi.patch(`/products/${product._id}/stock`, {
        stock: stockVal,
        inStock: nextInStock,
      });
      if (res && res.product) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? res.product : p))
        );
      }
    } catch (error) {
      console.error("Update stock error:", error);
      alert("Failed to update stock quantity: " + (error.message || "Network error"));
      fetchProducts();
    } finally {
      setTimeout(() => setSavingStockId(null), 1200);
    }
  };

  // Quick dialog for entering custom stock count
  const handlePromptCustomStock = (product) => {
    const current = product.stock ?? 0;
    const input = window.prompt(
      `Enter exact inventory count for "${product.name}":\n(Enter 0 to mark Out of Stock)`,
      String(current > 0 ? current : 10)
    );
    if (input !== null && input.trim() !== "") {
      handleUpdateStockAmount(product, input.trim());
    }
  };

  const handleToggleStock = async (product) => {
    const isCurrentlyInStock = product.inStock !== false && Number(product.stock) > 0;
    const nextStatus = !isCurrentlyInStock;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id
          ? {
              ...p,
              inStock: nextStatus,
              stock: nextStatus ? (p.stock > 0 ? p.stock : 10) : 0,
            }
          : p
      )
    );

    try {
      setSavingStockId(product._id);
      const res = await adminApi.patch(`/products/${product._id}/toggle-stock`, {
        inStock: nextStatus,
      });
      if (res && res.product) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? res.product : p))
        );
      }
    } catch (error) {
      console.error("Toggle stock error:", error);
      alert("Failed to update stock status: " + (error.message || "Network error"));
      fetchProducts();
    } finally {
      setTimeout(() => setSavingStockId(null), 1200);
    }
  };

  const saveProduct = async (e) => {
    e?.preventDefault();
    if (!formData.name || !formData.priceINR || !formData.sku) {
      alert("Please fill in Product Name, SKU, and Price (INR).");
      return;
    }

    try {
      setIsSubmitting(true);
      const allImages = Array.isArray(formData.images) && formData.images.length > 0
        ? formData.images.filter(Boolean)
        : (formData.image ? [formData.image] : []);

      const payload = {
        ...formData,
        priceINR: Number(formData.priceINR),
        stock: formData.inStock ? (Number(formData.stock) || 0) : 0,
        inStock: Boolean(formData.inStock),
        images: allImages,
        image: allImages[0] || "",
        video: formData.video || "",
      };

      let data;
      if (editingId) {
        data = await adminApi.put(`/products/${editingId}`, payload);
      } else {
        data = await adminApi.post("/products", payload);
      }

      if (data.success || data.product) {
        setShowForm(false);
        setEditingId(null);
        await fetchProducts();
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Save product error:", error);
      alert("Error saving product: " + (error.message || "Network issue"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiplePhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingImage(true);
      setUploadProgressText(`Uploading ${files.length} saree photo${files.length > 1 ? "s" : ""} to Cloudinary...`);

      const fd = new FormData();
      files.forEach((f) => fd.append("image", f));

      const data = await adminApi.uploadFile("/upload/image", fd);
      const newUrls = data?.imageUrls || (data?.imageUrl ? [data.imageUrl] : (data?.url ? [data.url] : []));

      if (newUrls.length > 0) {
        setFormData((prev) => {
          const currentImages = Array.isArray(prev.images) && prev.images.length > 0
            ? [...prev.images]
            : (prev.image ? [prev.image] : []);
          const merged = [...currentImages, ...newUrls];
          return {
            ...prev,
            images: merged,
            image: merged[0] || "",
          };
        });
      } else {
        alert("Failed to upload photos: " + (data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Photos upload error:", err);
      alert("Photo upload error: " + err.message);
    } finally {
      setUploadingImage(false);
      setUploadProgressText("");
      e.target.value = "";
    }
  };

  const handleAddManualPhotoUrl = () => {
    if (!manualPhotoUrl.trim()) return;
    const url = manualPhotoUrl.trim();
    setFormData((prev) => {
      const currentImages = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      if (!currentImages.includes(url)) {
        currentImages.push(url);
      }
      return {
        ...prev,
        images: currentImages,
        image: currentImages[0] || "",
      };
    });
    setManualPhotoUrl("");
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => {
      const filtered = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered,
        image: filtered[0] || "",
      };
    });
  };

  const handleSetMainPhoto = (indexToMain) => {
    setFormData((prev) => {
      const list = [...(prev.images || [])];
      const [chosen] = list.splice(indexToMain, 1);
      if (chosen) {
        list.unshift(chosen);
      }
      return {
        ...prev,
        images: list,
        image: list[0] || "",
      };
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingVideo(true);
      const fd = new FormData();
      fd.append("video", file);
      const data = await adminApi.uploadFile("/upload/video", fd);
      if (data?.videoUrl || data?.url) {
        setFormData((prev) => ({ ...prev, video: data.videoUrl || data.url }));
      } else {
        alert("Failed to upload video: " + (data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Video upload error:", err);
      alert("Video upload error: " + err.message);
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const deleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name || "this saree"}" from inventory?`
    );
    if (!confirmDelete) return;

    try {
      await adminApi.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Failed to delete product");
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = products.length;
    const outOfStockCount = products.filter(
      (p) => p.inStock === false || (Number(p.stock) || 0) === 0
    ).length;
    const inStockCount = total - outOfStockCount;
    const totalInventoryCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const lowStockCount = products.filter((p) => {
      const s = Number(p.stock) || 0;
      return p.inStock !== false && s > 0 && s <= 5;
    }).length;
    const avgPrice = total > 0
      ? Math.round(products.reduce((sum, p) => sum + (Number(p.priceINR) || 0), 0) / total)
      : 0;

    return { total, inStockCount, outOfStockCount, totalInventoryCount, lowStockCount, avgPrice };
  }, [products]);

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.toLowerCase()) ||
        item.fabric?.toLowerCase().includes(search.toLowerCase()) ||
        item.color?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        item.category?.toLowerCase() === categoryFilter.toLowerCase() ||
        item.collection?.toLowerCase() === categoryFilter.toLowerCase();

      const stockNum = Number(item.stock) || 0;
      const isItemOutOfStock = item.inStock === false || stockNum === 0;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && !isItemOutOfStock && stockNum <= 5) ||
        (stockFilter === "out" && isItemOutOfStock) ||
        (stockFilter === "in" && !isItemOutOfStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.collection) set.add(p.collection);
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] text-xs font-semibold tracking-wider font-serif uppercase">
              Jayant Saree Center • Catalog
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              Live Inventory
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2C2C] dark:text-[#FAF5EF] mt-1.5">
            Saree Catalog &amp; Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your sarees, mark out-of-stock items instantly with one click, and control live online availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-3 rounded-2xl border border-gray-200 dark:border-[#2C1F32] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#201426] transition"
            title="Refresh Catalog"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#6D1830] dark:text-[#E5C583]" : ""} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="
              inline-flex items-center gap-2
              bg-gradient-to-r from-[#6D1830] to-[#8C2F4D]
              text-[#FAF7F2] font-semibold text-sm
              px-6 py-3.5 rounded-2xl
              shadow-[0_10px_25px_rgba(109,24,48,0.25)]
              hover:shadow-[0_14px_30px_rgba(109,24,48,0.35)]
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
            "
          >
            <Plus size={18} />
            <span>Add Saree</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-[#18101C] rounded-2xl p-5 shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#6D1830]/10 text-[#6D1830] dark:bg-[#E5C583]/15 dark:text-[#E5C583] flex items-center justify-center shrink-0">
            <Package size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Designs</p>
            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF]">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18101C] rounded-2xl p-5 shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">In Stock Designs</p>
            <h3 className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
              {stats.inStockCount}{" "}
              <span className="text-xs font-sans font-normal text-gray-400 dark:text-gray-500">({stats.totalInventoryCount} pcs)</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18101C] rounded-2xl p-5 shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] flex items-center gap-4 transition-colors">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            stats.outOfStockCount > 0 ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
          }`}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Out of Stock</p>
            <h3 className={`text-2xl font-serif font-bold ${stats.outOfStockCount > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-[#FAF5EF]"}`}>
              {stats.outOfStockCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18101C] rounded-2xl p-5 shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] flex items-center gap-4 transition-colors">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            stats.lowStockCount > 0 ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}>
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Low Stock (&le;5 pcs)</p>
            <h3 className={`text-2xl font-serif font-bold ${stats.lowStockCount > 0 ? "text-amber-700 dark:text-amber-400" : "text-gray-900 dark:text-[#FAF5EF]"}`}>
              {stats.lowStockCount}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Search, Filters & View Mode Bar */}
      <div className="bg-white dark:bg-[#18101C] rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E8E2DC]/70 dark:border-[#2C1F32] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by saree name, SKU, fabric, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Layout Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Collection Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#120B15] focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#120B15] focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
          >
            <option value="all">All Status ({stats.total})</option>
            <option value="in">In Stock ({stats.inStockCount})</option>
            <option value="out">Out of Stock ({stats.outOfStockCount})</option>
            <option value="low">Low Stock (≤5)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#120B15] border border-transparent dark:border-[#2C1F32] rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "table" ? "bg-white dark:bg-[#2A1828] text-[#6D1830] dark:text-[#E5C583] shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "grid" ? "bg-white dark:bg-[#2A1828] text-[#6D1830] dark:text-[#E5C583] shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Products Presentation (Table vs Grid) */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-[#E8E2DC]/80">
          <div className="w-12 h-12 border-4 border-[#6D1830] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-gray-600">Loading your royal saree catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-[#E8E2DC]/80">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#D4B483] text-[#6D1830] flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h3 className="font-serif text-xl font-semibold text-gray-800">No Sarees Found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            {search || categoryFilter !== "all" || stockFilter !== "all"
              ? "No sarees matched your search or filters. Try adjusting criteria."
              : "Your catalog is empty. Click '+ Add Saree' to add your first piece."}
          </p>
          {(search || categoryFilter !== "all" || stockFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setStockFilter("all");
              }}
              className="mt-4 text-xs text-[#6D1830] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* --- ELEGANT TABLE VIEW --- */
        <div className="bg-white dark:bg-[#18101C] rounded-3xl shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-[#120B15] border-b border-[#E8E2DC] dark:border-[#2C1F32] text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase font-serif">
                  <th className="py-4 px-5">Saree</th>
                  <th className="py-4 px-4">SKU / Code</th>
                  <th className="py-4 px-4">Fabric &amp; Shade</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#251829] text-sm">
                {filteredProducts.map((product) => {
                  const stockNum = Number(product.stock) || 0;
                  const isItemOutOfStock = product.inStock === false || stockNum === 0;
                  const firstImage = product.images?.[0];

                  return (
                    <tr
                      key={product._id}
                      className={`hover:bg-[#FCFAF8] dark:hover:bg-[#201324] transition-colors duration-150 group ${
                        isItemOutOfStock ? "bg-red-50/20 dark:bg-red-950/20" : ""
                      }`}
                    >
                      {/* Saree & Thumbnail */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#140C18] border border-gray-200 dark:border-[#2C1F32] shrink-0 shadow-sm">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product.name}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                  isItemOutOfStock ? "grayscale-[40%]" : ""
                                }`}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                            )}
                            {isItemOutOfStock && (
                              <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-red-600 px-1 py-0.5 rounded shadow">
                                  Sold
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="font-serif font-semibold text-gray-900 dark:text-[#FAF5EF] block leading-tight group-hover:text-[#6D1830] dark:group-hover:text-[#E5C583] transition-colors">
                              {product.name}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">
                              {product.collection || "Jayant Saree Collection"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {product.sku || "—"}
                      </td>

                      {/* Fabric & Shade */}
                      <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="font-medium text-gray-800 dark:text-gray-200">{product.fabric || "Pure Cotton"}</div>
                        <div className="text-gray-400 dark:text-gray-500 text-[11px]">{product.color || "Multi-tone"}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-[#6D1830] dark:text-[#E5C583] font-mono text-base">
                        ₹{Number(product.priceINR || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Stock Status & Direct Editable Inventory */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* Live Status Badge & Save Confirmation */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                isItemOutOfStock
                                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                                  : stockNum <= 5
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isItemOutOfStock
                                    ? "bg-red-500"
                                    : stockNum <= 5
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              />
                              <span>{isItemOutOfStock ? "Out of Stock" : `${stockNum} in stock`}</span>
                            </span>

                            {savingStockId === product._id && (
                              <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
                                Saved ✓
                              </span>
                            )}
                          </div>

                          {/* Direct Custom Stock Quantity Input & Stepper */}
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:border-[#6D1830] transition">
                              <button
                                type="button"
                                onClick={() => handleUpdateStockAmount(product, Math.max(0, stockNum - 1))}
                                className="w-6 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black font-bold text-xs"
                                title="Reduce stock by 1"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={
                                  editingStockState[product._id] !== undefined
                                    ? editingStockState[product._id]
                                    : stockNum
                                }
                                onChange={(e) =>
                                  setEditingStockState({
                                    ...editingStockState,
                                    [product._id]: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUpdateStockAmount(product, e.currentTarget.value);
                                    e.currentTarget.blur();
                                  }
                                }}
                                onBlur={(e) => {
                                  if (editingStockState[product._id] !== undefined) {
                                    handleUpdateStockAmount(product, e.target.value);
                                  }
                                }}
                                className="w-14 h-7 text-center font-mono font-bold text-xs bg-transparent focus:outline-none focus:bg-amber-50/60"
                                title="Type your own stock quantity and press Enter"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateStockAmount(product, stockNum + 1)}
                                className="w-6 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black font-bold text-xs"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>

                            {/* Quick Prompt Button */}
                            <button
                              type="button"
                              onClick={() => handlePromptCustomStock(product)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#6D1830] hover:bg-gray-100 transition"
                              title="Enter custom stock number"
                            >
                              <Edit3 size={12} />
                            </button>

                            {/* 1-Click Zero Out or Restore */}
                            <button
                              type="button"
                              onClick={() => handleToggleStock(product)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                                isItemOutOfStock
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              }`}
                              title={isItemOutOfStock ? "Restock item" : "Mark as 0 (Out of Stock)"}
                            >
                              {isItemOutOfStock ? "Restock" : "Zero"}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStock(product)}
                            className={`p-2 rounded-xl transition ${
                              isItemOutOfStock
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-amber-600 hover:bg-amber-50"
                            }`}
                            title={isItemOutOfStock ? "Mark as In Stock" : "Mark as Out of Stock"}
                          >
                            {isItemOutOfStock ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                          </button>
                          <button
                            onClick={() => setPreviewProduct(product)}
                            className="p-2 rounded-xl text-gray-500 hover:text-[#6D1830] hover:bg-[#FAF8F5] transition"
                            title="Quick Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => editProduct(product)}
                            className="p-2 rounded-xl text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition"
                            title="Edit Saree Details"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id, product.name)}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Saree"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2DC] flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filteredProducts.length} of {products.length} catalog items</span>
            <span className="font-serif">Jayant Saree Center • Verified Inventory</span>
          </div>
        </div>
      ) : (
        /* --- VISUAL PRODUCT CARDS GRID --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockNum = Number(product.stock) || 0;
            const isItemOutOfStock = product.inStock === false || stockNum === 0;
            const firstImage = product.images?.[0];

            return (
              <div
                key={product._id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  isItemOutOfStock ? "border-red-200 opacity-90" : "border-[#E8E2DC]/80"
                }`}
              >
                <div>
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          isItemOutOfStock ? "grayscale-[35%]" : ""
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={40} />
                      </div>
                    )}

                    {/* Stock Status Badge with Clickable Quick-Toggle */}
                    <div className="absolute top-3 left-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStock(product);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                          isItemOutOfStock
                            ? "bg-red-600 text-white"
                            : stockNum <= 5
                            ? "bg-amber-500/90 text-white"
                            : "bg-black/60 text-white"
                        }`}
                        title={isItemOutOfStock ? "Click to Mark In Stock" : "Click to Mark Out of Stock"}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isItemOutOfStock ? "bg-white" : "bg-emerald-400"}`} />
                        <span>{isItemOutOfStock ? "Out of Stock" : `${stockNum} left`}</span>
                      </button>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editProduct(product)}
                        className="w-8 h-8 rounded-full bg-white text-gray-700 shadow-md flex items-center justify-center hover:bg-[#6D1830] hover:text-white transition"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id, product.name)}
                        className="w-8 h-8 rounded-full bg-white text-red-600 shadow-md flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      {product.sku || "ETH-SAR"}
                    </span>
                    <h3 className="font-serif font-semibold text-gray-900 text-base mt-0.5 line-clamp-1 group-hover:text-[#6D1830] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {product.fabric || "Cotton"} • {product.color || "Standard"}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex flex-col gap-2.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#6D1830] text-lg">
                      ₹{Number(product.priceINR || 0).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => editProduct(product)}
                      className="text-xs font-semibold text-[#6D1830] hover:underline"
                    >
                      Edit Details &rarr;
                    </button>
                  </div>

                  {/* Custom Stock Counter Stepper & Prompt on Card */}
                  <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-gray-50">
                    <span className="text-[11px] font-medium text-gray-500">
                      Stock:
                    </span>
                    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateStockAmount(product, Math.max(0, stockNum - 1))}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-xs"
                        title="Reduce by 1"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={
                          editingStockState[product._id] !== undefined
                            ? editingStockState[product._id]
                            : stockNum
                        }
                        onChange={(e) =>
                          setEditingStockState({
                            ...editingStockState,
                            [product._id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateStockAmount(product, e.currentTarget.value);
                            e.currentTarget.blur();
                          }
                        }}
                        onBlur={(e) => {
                          if (editingStockState[product._id] !== undefined) {
                            handleUpdateStockAmount(product, e.target.value);
                          }
                        }}
                        className="w-12 h-6 text-center font-mono font-bold text-xs bg-transparent focus:outline-none focus:bg-amber-50"
                        title="Type quantity and press Enter"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateStockAmount(product, stockNum + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-xs"
                        title="Increase by 1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePromptCustomStock(product)}
                      className="px-2 py-1 rounded text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                      title="Set custom stock"
                    >
                      Set
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStock(product)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                        isItemOutOfStock
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-red-600 bg-red-50 hover:bg-red-100"
                      }`}
                      title={isItemOutOfStock ? "Mark as In Stock" : "Zero out stock"}
                    >
                      {isItemOutOfStock ? "In Stock" : "Out"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. ADD / EDIT PRODUCT MODAL (LUXURY ATELIER FORM) */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white dark:bg-[#18101C] w-full max-w-3xl rounded-[28px] sm:rounded-[32px] shadow-2xl border border-[#D4B483]/50 dark:border-[#38283E] overflow-hidden my-auto transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-white p-6 sm:p-7 flex items-center justify-between">
              <div>
                <span className="text-xs font-serif uppercase tracking-[2px] text-[#E5C583]">
                  {editingId ? "Edit Drape" : "New Addition"}
                </span>
                <h2 className="text-2xl font-serif font-bold mt-0.5">
                  {editingId ? `Update: ${formData.name || "Saree"}` : "Add Heritage Saree"}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={saveProduct} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Saree Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Saree Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Royal Banarasi Zari Silk Saree"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] focus:ring-1 focus:ring-[#6D1830]"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    SKU Code *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ETH-BAN-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-mono focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Price INR */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Price (INR ₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="2499"
                    value={formData.priceINR}
                    onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        stock: val,
                        inStock: Number(val) > 0 ? true : false,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />

                  {/* Quick Preset Buttons for Custom Stock */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mr-1">Quick Add:</span>
                    {[5, 10, 25, 50].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => {
                          const cur = Number(formData.stock) || 0;
                          const next = cur + inc;
                          setFormData({
                            ...formData,
                            stock: String(next),
                            inStock: true,
                          });
                        }}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#251525] hover:bg-gray-200 dark:hover:bg-[#321B32] text-gray-700 dark:text-gray-300 text-[11px] font-semibold transition"
                      >
                        +{inc}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          stock: "0",
                          inStock: false,
                        });
                      }}
                      className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-[11px] font-semibold transition"
                    >
                      0 (Out of Stock)
                    </button>
                  </div>
                </div>

                {/* Live Availability Toggle */}
                <div className="sm:col-span-2 bg-[#FAF8F5] dark:bg-[#140C18] p-4 rounded-2xl border border-[#E8E2DC] dark:border-[#2C1F32] flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-xs font-bold text-gray-800 dark:text-[#FAF5EF] uppercase tracking-wider block">
                      Product Availability Status
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      When marked &quot;Out of Stock&quot;, customer buttons are disabled and a &quot;Sold Out&quot; badge appears.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          inStock: checked,
                          stock: !checked ? 0 : (Number(formData.stock) > 0 ? formData.stock : "10"),
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6D1830]"></div>
                    <span className={`ml-3 text-xs font-bold ${formData.inStock ? "text-[#6D1830] dark:text-[#E5C583]" : "text-red-600 dark:text-red-400"}`}>
                      {formData.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </label>
                </div>

                {/* Collection / Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Collection / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Festive Silk, Cotton Saree"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Fabric
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Zari Silk Blend"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Color / Shade */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Color / Shade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Crimson Red"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Saree Length */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Saree Length
                  </label>
                  <input
                    type="text"
                    placeholder="5.5 Meters"
                    value={formData.sareeLength}
                    onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>

                {/* Blouse Piece */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Blouse Piece
                  </label>
                  <input
                    type="text"
                    placeholder="0.8 Meter Running"
                    value={formData.blouse}
                    onChange={(e) => setFormData({ ...formData, blouse: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />
                </div>
              </div>

              {/* Highlight Tagline */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Highlight Badge / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Zari Weave • Festive Edition"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the texture, weave, drape feel, and care instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                />
              </div>

              {/* Saree Photos & Lookbook Media Section */}
              <div className="space-y-6 pt-3 border-t border-gray-100 dark:border-[#2C1F32]">
                {/* 1. Saree Photos Multi-Upload & Gallery */}
                <div className="bg-[#FAF8F5] dark:bg-[#140C18] p-5 sm:p-6 rounded-2xl border border-[#E8E2DC] dark:border-[#2C1F32] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-800 dark:text-[#FAF5EF] uppercase tracking-wider">
                          Saree Photo Gallery
                        </label>
                        <span className="px-2 py-0.5 rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] text-[11px] font-semibold">
                          {(formData.images || []).length} Photos
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Upload multiple photos of this saree (drape, pallu, pleats, borders, blouse). First photo is the main cover.
                      </p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#6D1830] hover:bg-[#541224] text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-sm self-start sm:self-auto">
                      <Upload size={14} />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photos from Computer"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultiplePhotosUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadingImage && (
                    <div className="mb-4 p-3 rounded-xl bg-[#6D1830]/10 dark:bg-[#E5C583]/10 border border-[#6D1830]/20 dark:border-[#E5C583]/20 flex items-center gap-3 text-xs text-[#6D1830] dark:text-[#E5C583] font-semibold animate-pulse">
                      <div className="w-4 h-4 border-2 border-[#6D1830] dark:border-[#E5C583] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span>{uploadProgressText || "Uploading saree photos to Cloudinary CDN..."}</span>
                    </div>
                  )}

                  {/* Visual Photo Cards Gallery */}
                  {(formData.images || []).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 mb-4">
                      {(formData.images || []).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition group bg-white dark:bg-[#1E1122] shadow-xs ${
                            idx === 0
                              ? "border-[#6D1830] dark:border-[#E5C583] ring-2 ring-[#6D1830]/20 dark:ring-[#E5C583]/20"
                              : "border-gray-200 dark:border-[#2C1F32] hover:border-gray-400 dark:hover:border-[#502946]"
                          }`}
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-black/30">
                            <img
                              src={imgUrl}
                              alt={`Saree photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>

                          {/* Badge */}
                          <div className="absolute top-2 left-2">
                            {idx === 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-[#6D1830] text-[#E8C58D] text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Star size={10} fill="#E8C58D" /> Cover
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow transition"
                                title="Remove photo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetMainPhoto(idx)}
                                className="w-full py-1 rounded bg-[#6D1830] hover:bg-[#541224] text-[#E8C58D] text-[10px] font-semibold tracking-wider uppercase transition shadow flex items-center justify-center gap-1"
                              >
                                <Star size={11} /> Make Cover
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-[#38283E] p-6 text-center mb-4 bg-white/60 dark:bg-[#1A1120]/60">
                      <ImageIcon size={28} className="mx-auto text-gray-400 dark:text-gray-500 mb-1.5" />
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">No photos added yet</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        Click "Upload Photos from Computer" above to select multiple photos of this saree.
                      </p>
                    </div>
                  )}

                  {/* Manual URL entry fallback */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200/80 dark:border-[#2C1F32]">
                    <input
                      type="text"
                      placeholder="Or paste external photo URL (https://...)"
                      value={manualPhotoUrl}
                      onChange={(e) => setManualPhotoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddManualPhotoUrl();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] text-xs focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualPhotoUrl}
                      disabled={!manualPhotoUrl.trim()}
                      className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#251525] hover:bg-gray-200 dark:hover:bg-[#351E35] text-gray-700 dark:text-gray-200 text-xs font-semibold transition disabled:opacity-40"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* 2. Lookbook Video Section */}
                <div className="bg-[#FAF8F5] dark:bg-[#140C18] p-5 rounded-2xl border border-[#E8E2DC] dark:border-[#2C1F32] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 dark:text-[#FAF5EF] uppercase tracking-wider">
                        Lookbook Video Reel (Optional)
                      </label>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Add a draping video or living lookbook clip for this saree.
                      </p>
                    </div>
                    <label className="cursor-pointer text-xs font-semibold text-[#6D1830] dark:text-[#E5C583] hover:text-[#541224] flex items-center gap-1.5 bg-[#6D1830]/10 dark:bg-[#E5C583]/15 hover:bg-[#6D1830]/15 px-3 py-1.5 rounded-lg transition border border-[#6D1830]/20 dark:border-[#E5C583]/30">
                      <Upload size={13} />
                      <span>{uploadingVideo ? "Uploading..." : "Upload from Computer"}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Paste video URL or click 'Upload from Computer'"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:border-[#6D1830] dark:focus:border-[#E5C583]"
                  />

                  {uploadingVideo && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6D1830] dark:text-[#E5C583] font-medium animate-pulse">
                      <div className="w-3.5 h-3.5 border-2 border-[#6D1830] dark:border-[#E5C583] border-t-transparent rounded-full animate-spin" />
                      <span>Uploading video reel to Cloudinary...</span>
                    </div>
                  )}

                  {formData.video && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 dark:border-[#2C1F32] bg-black max-w-xs">
                      <video src={formData.video} controls className="w-full max-h-48" />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#2C1F32]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#38283E] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1120] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    px-6 py-2.5 rounded-xl
                    bg-[#6D1830] hover:bg-[#561225]
                    text-white text-sm font-semibold
                    shadow-md transition
                    disabled:opacity-50
                  "
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Saree" : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. QUICK PREVIEW MODAL */}
      {previewProduct && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-[#D4B483]"
            onClick={(e) => setPreviewProduct(null)}
          >
            <div className="relative aspect-[4/5] bg-black">
              <img
                src={previewProduct.images?.[0]}
                alt={previewProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <span className="text-xs font-mono text-gray-400">{previewProduct.sku}</span>
              <h3 className="font-serif font-bold text-xl text-gray-900 mt-1">{previewProduct.name}</h3>
              <p className="font-serif font-bold text-2xl text-[#6D1830] mt-2">
                ₹{Number(previewProduct.priceINR || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-600 mt-3">{previewProduct.description}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const p = previewProduct;
                    setPreviewProduct(null);
                    editProduct(p);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6D1830] text-white text-xs font-semibold"
                >
                  Edit This Saree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;