import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Heart,
  ShoppingCart,
  Search,
  X,
  Sparkles,
  Eye,
  Check,
  Award,
  Truck,
  Scissors,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_BASE } from "../services/apiConfig.js";
import { WishlistContext } from "../context/Wishlistcontext";
import { CartContext } from "../context/CartContext";
import { CountryContext } from "../context/CoutryContext";
import toast from "react-hot-toast";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedAnimId, setAddedAnimId] = useState(null);

  const [priceFilter, setPriceFilter] = useState("all"); // 'all' | '5k-100k' | '5k-25k' | '25k-50k' | '50k-100k'
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [quickViewImageIdx, setQuickViewImageIdx] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { formatPrice } = useContext(CountryContext);

  useEffect(() => {
    fetchProducts();
    // Support category query param like /products?cat=cotton
    const catParam = searchParams.get("cat");
    if (catParam) {
      const lower = catParam.toLowerCase();
      if (lower === "cotton") setSelectedCategory("Cotton");
      else if (lower === "art") setSelectedCategory("Art");
      else if (lower === "silk") setSelectedCategory("Silk");
      else if (lower === "maheshwari" || lower === "maheswari") setSelectedCategory("Maheshwari");
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Fetch products error:", error);
      toast.error("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  const isProductInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some((item) => (item._id || item.id) === productId);
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    const inWish = isProductInWishlist(product._id);
    toast.success(inWish ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0)) {
      toast.error("Sorry, this saree is currently out of stock!");
      return;
    }
    addToCart(product);
    setAddedAnimId(product._id);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddedAnimId(null), 1600);
  };

  // Nike-Style Saree Categories requested by user
  const categories = [
    "All",
    "Cotton",
    "Art",
    "Silk",
    "Maheshwari",
  ];

  // Filter and Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const highlight = (product.highlight || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      const fabric = (product.fabric || "").toLowerCase();
      const searchLower = search.toLowerCase();

      // Search matching
      const matchesSearch =
        name.includes(searchLower) ||
        highlight.includes(searchLower) ||
        category.includes(searchLower) ||
        fabric.includes(searchLower);

      if (!matchesSearch) return false;

      // Category matching: 1) Cotton, 2) Art, 3) Silk, 4) Maheshwari
      if (selectedCategory === "Cotton") {
        const isCotton = name.includes("cotton") || category.includes("cotton") || highlight.includes("cotton") || fabric.includes("cotton");
        if (!isCotton) return false;
      } else if (selectedCategory === "Art") {
        const isArt = name.includes("art") || category.includes("art") || highlight.includes("art") || fabric.includes("art");
        if (!isArt) return false;
      } else if (selectedCategory === "Silk") {
        const isSilk = name.includes("silk") || category.includes("silk") || highlight.includes("silk") || fabric.includes("silk") || name.includes("zari");
        if (!isSilk) return false;
      } else if (selectedCategory === "Maheshwari") {
        const isMaheshwari = name.includes("maheshwari") || name.includes("maheswari") || category.includes("maheshwari") || category.includes("maheswari") || highlight.includes("maheshwari") || fabric.includes("maheshwari");
        if (!isMaheshwari) return false;
      }

      // Price filter matching (5,000 to 1 Lakh range)
      const price = Number(product.priceINR) || 0;
      if (priceFilter === "5k-100k" && (price < 5000 || price > 100000)) return false;
      if (priceFilter === "5k-25k" && (price < 5000 || price > 25000)) return false;
      if (priceFilter === "25k-50k" && (price < 25000 || price > 50000)) return false;
      if (priceFilter === "50k-100k" && (price < 50000 || price > 100000)) return false;
      if (priceFilter === "custom" && (price < minPrice || price > maxPrice)) return false;

      return true;
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.priceINR || 0) - (a.priceINR || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [products, search, selectedCategory, priceFilter, minPrice, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-400">

      {/* --- Section 1: Haute Couture Saree Atelier Banner --- */}
      <div
        className="
          relative
          h-[260px] sm:h-[320px] lg:h-[360px]
          rounded-[32px]
          overflow-hidden
          mb-10 sm:mb-12
          border-2 border-[#D4B483]/60 dark:border-[#E5C583]/40
          shadow-[0_20px_50px_rgba(109,24,48,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)]
          group
        "
      >
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c"
          alt="Ethnique Designer Sarees by Jayant Saree Center"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Editorial Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/90 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/60 bg-black/40 backdrop-blur-md text-[#FAF6F0] text-[10px] sm:text-xs font-semibold tracking-[3px] uppercase mb-3.5 shadow-md">
            <Sparkles size={12} className="text-[#E5C583]" />
            <span>JAYANT SAREE CENTER • ETHNIQUE</span>
            <Sparkles size={12} className="text-[#E5C583]" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-md tracking-tight">
            Designer Saree Collection
          </h1>

          <p className="mt-3 text-xs sm:text-sm lg:text-base text-gray-200 font-light max-w-lg leading-relaxed">
            Curated festive, wedding, and everyday drapes from the trusted house of Jayant Saree Center.
          </p>
        </div>
      </div>

      {/* --- Section 2: Glassmorphic Heritage Stats Cards --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="p-5 rounded-2xl bg-white/75 dark:bg-[#18101C]/75 backdrop-blur-md border border-[#E8DFD3] dark:border-[#2C1F32] shadow-sm hover:border-[#D4B483] dark:hover:border-[#E5C583] hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] flex items-center justify-center mb-2.5">
            <Layers size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2B2523] dark:text-[#F7F2EC]">
            {products.length > 0 ? `${products.length}+` : "24+"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5 uppercase tracking-wider">
            Curated Designs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/75 dark:bg-[#18101C]/75 backdrop-blur-md border border-[#E8DFD3] dark:border-[#2C1F32] shadow-sm hover:border-[#D4B483] dark:hover:border-[#E5C583] hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] flex items-center justify-center mb-2.5">
            <Award size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2B2523] dark:text-[#F7F2EC]">
            100% Genuine
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5 uppercase tracking-wider">
            Finest Quality Fabrics
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/75 dark:bg-[#18101C]/75 backdrop-blur-md border border-[#E8DFD3] dark:border-[#2C1F32] shadow-sm hover:border-[#D4B483] dark:hover:border-[#E5C583] hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] flex items-center justify-center mb-2.5">
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2B2523] dark:text-[#F7F2EC]">
            Handloom Craft
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5 uppercase tracking-wider">
            Pure Artisanal Weaves
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/75 dark:bg-[#18101C]/75 backdrop-blur-md border border-[#E8DFD3] dark:border-[#2C1F32] shadow-sm hover:border-[#D4B483] dark:hover:border-[#E5C583] hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#6D1830]/10 dark:bg-[#E5C583]/15 text-[#6D1830] dark:text-[#E5C583] flex items-center justify-center mb-2.5">
            <Truck size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2B2523] dark:text-[#F7F2EC]">
            Free Delivery
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5 uppercase tracking-wider">
            Pan-India Insured Dispatch
          </p>
        </div>
      </div>

      {/* --- Section 3: Smart Search, Nike-Style Categories & ₹5k-₹1L Price Filter --- */}
      <div className="bg-white/80 dark:bg-[#18101C]/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] dark:border-[#2C1F32] shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search Input with Clear Button */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by saree weave, color, or motif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-[#FAF6F0] dark:bg-[#201426]
                text-[#2B2523] dark:text-[#F7F2EC]
                placeholder-gray-400 dark:placeholder-gray-500
                border border-[#E8DFD3] dark:border-[#33223B]
                focus:border-[#D4B483] dark:focus:border-[#E5C583]
                rounded-full
                pl-11 pr-10 py-3 text-xs sm:text-sm
                shadow-inner outline-none transition
              "
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ArrowUpDown size={14} className="text-[#D4B483]" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                bg-[#FAF6F0] dark:bg-[#201426]
                text-[#2B2523] dark:text-[#F7F2EC]
                border border-[#E8DFD3] dark:border-[#33223B]
                focus:border-[#D4B483] dark:focus:border-[#E5C583]
                rounded-full px-4 py-2.5 text-xs font-medium
                outline-none cursor-pointer shadow-sm
              "
            >
              <option value="featured">Featured Weaves</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

        </div>

        {/* Nike-Style Saree Category Switcher (1. Cotton, 2. Art, 3. Silk, 4. Maheshwari) */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pt-4 mt-4 border-t border-[#E8DFD3]/80 dark:border-[#2C1F32]">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-gray-400 mr-1 hidden sm:inline">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer
                ${
                  selectedCategory === cat
                    ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md scale-[1.03]"
                    : "bg-[#FAF6F0] dark:bg-[#201426] text-gray-700 dark:text-gray-300 border border-[#E8DFD3] dark:border-[#33223B] hover:border-[#D4B483]"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ₹5,000 to ₹1,00,000 Price Range Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-[#E8DFD3]/50 dark:border-[#2C1F32]/50 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 uppercase font-semibold text-[11px] tracking-wider mr-2">
            <SlidersHorizontal size={13} className="text-[#D4B483]" />
            <span>Price (₹5k - ₹1L):</span>
          </div>
          {[
            { id: "all", label: "All Prices" },
            { id: "5k-100k", label: "₹5,000 - ₹1,00,000 (Full Range)" },
            { id: "5k-25k", label: "₹5,000 - ₹25,000" },
            { id: "25k-50k", label: "₹25,000 - ₹50,000" },
            { id: "50k-100k", label: "₹50,000 - ₹1,00,000" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setPriceFilter(range.id)}
              className={`
                px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all cursor-pointer
                ${
                  priceFilter === range.id
                    ? "bg-[#D4B483] dark:bg-[#E5C583] text-black font-bold shadow-xs scale-102"
                    : "bg-white/80 dark:bg-[#221629] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-[#D4B483]"
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Section 4: Live Results Count --- */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="font-serif text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
          Showing <span className="font-bold text-[#6D1830] dark:text-[#E5C583]">{filteredAndSortedProducts.length}</span> Designer Drapes
        </h2>
        {(selectedCategory !== "All" || search) && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
            className="text-xs text-[#8C2F4D] dark:text-[#E5C583] underline hover:no-underline font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* --- Section 5: Haute-Couture Saree Product Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-start">
        {filteredAndSortedProducts.map((product) => {
          const inWishlist = isProductInWishlist(product._id);
          const isAdded = addedAnimId === product._id;
          const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

          return (
            <div
              key={product._id}
              className={`
                group relative
                bg-white dark:bg-[#18101C]
                rounded-t-[36px] rounded-b-[22px]
                overflow-hidden
                border ${isOutOfStock ? "border-red-200 dark:border-red-950/60 opacity-90" : "border-[#E8DFD3] dark:border-[#2C1F32]"}
                hover:border-[#D4B483] dark:hover:border-[#E5C583]
                shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                hover:shadow-[0_20px_45px_rgba(109,24,48,0.14)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]
                hover:-translate-y-2
                transition-all duration-500 flex flex-col justify-between
              `}
            >
              <div
                onClick={() => navigate(`/products/${product._id}`)}
                className="cursor-pointer"
              >
                {/* Image Container with Arched Top & Secondary Hover Reveal */}
                <div className="relative h-[420px] sm:h-[460px] overflow-hidden bg-[#FAF6F0] dark:bg-[#1D1322] rounded-t-[34px]">
                  {/* Primary Image */}
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      transition-all duration-700
                      group-hover:opacity-0 group-hover:scale-105
                      ${isOutOfStock ? "grayscale-[35%]" : ""}
                    `}
                  />

                  {/* Secondary Image on Hover */}
                  <img
                    src={product.images?.[1] || product.images?.[0]}
                    alt={`${product.name} alternate view`}
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      opacity-0 transition-all duration-700
                      group-hover:opacity-100 group-hover:scale-105
                      ${isOutOfStock ? "grayscale-[35%]" : ""}
                    `}
                  />

                  {/* Craft / Out of Stock Tag Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    {isOutOfStock ? (
                      <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Sold Out
                      </span>
                    ) : (
                      <span className="bg-white/95 dark:bg-[#18101C]/95 backdrop-blur-md border border-[#D4B483]/60 dark:border-[#E5C583]/50 text-[#6D1830] dark:text-[#E5C583] text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                        Designer
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label="Add to Wishlist"
                    className={`
                      absolute top-4 right-4 z-10
                      p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md
                      ${
                        inWishlist
                          ? "bg-[#8C2F4D] text-white scale-110"
                          : "bg-white/85 dark:bg-[#18101C]/85 text-gray-700 dark:text-gray-200 hover:bg-white hover:text-[#8C2F4D] dark:hover:text-[#E5C583] hover:scale-110"
                      }
                    `}
                  >
                    <Heart size={16} className={inWishlist ? "fill-white" : ""} />
                  </button>

                  {/* Quick View Hover Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                      setQuickViewImageIdx(0);
                    }}
                    className="
                      absolute bottom-4 left-1/2 -translate-x-1/2
                      bg-white/95 dark:bg-[#1A111E]/95 backdrop-blur-md
                      text-[#2B2523] dark:text-[#F7F2EC]
                      border border-[#D4B483]
                      px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase
                      shadow-xl opacity-0 group-hover:opacity-100
                      transition-all duration-300 hover:scale-105 flex items-center gap-1.5
                    "
                  >
                    <Eye size={13} />
                    <span>Quick View</span>
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-[2px] uppercase text-[#8C2F4D] dark:text-[#E5C583]">
                      Heritage Drape
                    </span>
                    {isOutOfStock && (
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg text-[#2B2523] dark:text-[#F7F2EC] mt-1 font-semibold group-hover:text-[#8C2F4D] dark:group-hover:text-[#E5C583] transition-colors truncate">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-light">
                    {product.highlight || "Breathable fabric with traditional weaving patterns."}
                  </p>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#F0EAE1] dark:border-[#261D2B]">
                    <span className="font-serif text-xl font-bold text-[#2B2523] dark:text-[#F7F2EC]">
                      {formatPrice ? formatPrice(product.priceINR) : `₹${product.priceINR}`}
                    </span>

                    {isOutOfStock ? (
                      <button
                        type="button"
                        disabled
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gray-100 dark:bg-[#221627] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-[#38283E] cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                        className={`
                          px-3.5 py-2 rounded-full text-xs font-medium tracking-wide
                          transition-all duration-300 flex items-center gap-1.5 shadow-sm
                          ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#FAF6F0] dark:bg-[#241729] text-[#6D1830] dark:text-[#E5C583] hover:bg-[#6D1830] hover:text-white dark:hover:bg-[#E5C583] dark:hover:text-black border border-[#E8DFD3] dark:border-[#38283E]"
                          }
                        `}
                      >
                        {isAdded ? (
                          <>
                            <Check size={13} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={13} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero State */}
      {filteredAndSortedProducts.length === 0 && !loading && (
        <div className="text-center py-20 bg-white/50 dark:bg-[#18101C]/50 rounded-3xl border border-[#E8DFD3] dark:border-[#2C1F32]">
          <p className="font-serif text-2xl text-[#6D1830] dark:text-[#E5C583]">No Sarees Found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light">
            Try adjusting your search keyword or selected category filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-5 px-6 py-2.5 rounded-full bg-[#6D1830] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Quick View Modal with Multi-Image Gallery */}
      {quickViewProduct && (() => {
        const qvImages = (Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0)
          ? quickViewProduct.images
          : [quickViewProduct.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c"];

        return (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <div
              className="
                relative bg-white dark:bg-[#18101C]
                max-w-3xl w-full rounded-3xl overflow-hidden
                border border-[#D4B483] shadow-2xl
                grid grid-cols-1 md:grid-cols-2
                animate-fadeIn
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Interactive Image Gallery */}
              <div className="relative flex flex-col bg-[#FAF6F0] dark:bg-[#1D1322]">
                <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden group">
                  <img
                    src={qvImages[quickViewImageIdx] || qvImages[0]}
                    alt={`${quickViewProduct.name} - view ${quickViewImageIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Image Counter Badge */}
                  {qvImages.length > 1 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider">
                      {quickViewImageIdx + 1} / {qvImages.length}
                    </div>
                  )}

                  {/* Next / Previous Arrow Controls */}
                  {qvImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous Image"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewImageIdx((prev) => (prev > 0 ? prev - 1 : qvImages.length - 1));
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label="Next Image"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewImageIdx((prev) => (prev < qvImages.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Row */}
                {qvImages.length > 1 && (
                  <div className="flex items-center gap-2 p-3 bg-black/10 dark:bg-black/40 overflow-x-auto border-t border-black/5">
                    {qvImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuickViewImageIdx(idx)}
                        className={`
                          w-12 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer
                          ${
                            quickViewImageIdx === idx
                              ? "border-[#8C2F4D] dark:border-[#E5C583] scale-105 shadow-sm"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }
                        `}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Saree Details & Action */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[2px] uppercase text-[#8C2F4D] dark:text-[#E5C583] font-semibold">
                      Designer Drape
                    </span>
                    {(quickViewProduct.inStock === false || (quickViewProduct.stock !== undefined && Number(quickViewProduct.stock) <= 0)) && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl text-[#2B2523] dark:text-[#F7F2EC] mt-2 font-semibold">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-2xl font-bold font-serif text-[#6D1830] dark:text-[#E5C583] mt-3">
                    {formatPrice ? formatPrice(quickViewProduct.priceINR) : `₹${quickViewProduct.priceINR}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed font-light">
                    {quickViewProduct.description || quickViewProduct.highlight || "Curated designer saree from Jayant Saree Center, finished with elegant motifs and comfortable all-day drape."}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2C1F32] flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Fabric: <strong className="text-gray-800 dark:text-gray-200">{quickViewProduct.fabric || "Pure Silk Blend"}</strong></span>
                    <span>&bull;</span>
                    <span>Color: <strong className="text-gray-800 dark:text-gray-200">{quickViewProduct.color || "Heritage"}</strong></span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {quickViewProduct.inStock === false || (quickViewProduct.stock !== undefined && Number(quickViewProduct.stock) <= 0) ? (
                    <button
                      disabled
                      className="flex-1 bg-gray-200 dark:bg-[#201525] text-gray-400 dark:text-gray-500 py-3 rounded-full text-xs font-semibold tracking-wider uppercase cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>Currently Out of Stock</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleAddToCart(e, quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 bg-[#6D1830] hover:bg-[#8C2F4D] text-white py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={15} />
                      <span>Add To Bag</span>
                    </button>
                  )}
                  <Link
                    to={`/product/${quickViewProduct._id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="px-4 py-3 rounded-full border border-[#D4B483] text-[#8C2F4D] dark:text-[#E5C583] text-xs font-semibold hover:bg-[#FAF6F0] dark:hover:bg-[#201426] transition text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-[#201426] transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default AllProducts;