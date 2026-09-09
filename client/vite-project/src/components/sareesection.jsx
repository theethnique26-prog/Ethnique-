import React, { useEffect, useState, useContext } from "react";
import { Heart, ShoppingCart, Sparkles, ArrowRight, Eye, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/Wishlistcontext";
import { CartContext } from "../context/CartContext";
import { CountryContext } from "../context/CoutryContext";
import { API_BASE } from "../services/apiConfig.js";

function SareeSection() {
  const { formatPrice } = useContext(CountryContext);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [featuredSection, setFeaturedSection] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedAnimId, setAddedAnimId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedSection();
  }, []);

  const fetchFeaturedSection = async () => {
    try {
      const response = await fetch(`${API_BASE}/homepage`);
      const data = await response.json();
      setFeaturedSection(data);
    } catch (error) {
      console.log("HOMEPAGE ERROR:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  const isProductInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some((item) => (item._id || item.id) === productId);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0)) {
      return;
    }
    addToCart(product);
    setAddedAnimId(product._id);
    setTimeout(() => setAddedAnimId(null), 1500);
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "all") return true;
    const name = (p.name || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    if (activeCategory === "cotton") return name.includes("cotton") || category.includes("cotton");
    if (activeCategory === "silk") return name.includes("silk") || category.includes("silk");
    if (activeCategory === "festive") return name.includes("festive") || name.includes("zari") || category.includes("festive");
    return true;
  });

  return (
    <section id="featured-sarees" className="py-16 sm:py-24 transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E8DFD3]/80 dark:border-[#2C1F32] pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#8C2F4D] dark:text-[#E5C583] text-xs font-semibold tracking-[3px] uppercase mb-2">
              <Sparkles size={14} className="text-[#C8A261]" />
              <span>Curated Atelier</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2B2523] dark:text-[#F7F2EC]">
              New Arrivals
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base font-light max-w-xl">
              Handpicked elegance crafted for everyday comfort and sacred celebratory moments.
            </p>
          </div>

          {/* Category Filter Pills & Explore Link */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {[
              { id: "all", label: "All Sarees" },
              { id: "cotton", label: "Pure Cotton" },
              { id: "silk", label: "Pure Silk" },
              { id: "festive", label: "Festive Edit" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300
                  ${
                    activeCategory === cat.id
                      ? "bg-[#6D1830] dark:bg-[#E5C583] text-white dark:text-black shadow-md scale-[1.03]"
                      : "bg-white/80 dark:bg-[#1A111E] text-gray-700 dark:text-gray-300 border border-[#E8DFD3] dark:border-[#2C1F32] hover:border-[#D4B483]"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}

            <Link
              to="/products"
              className="
                inline-flex items-center gap-1.5 ml-2
                text-xs sm:text-sm font-semibold tracking-wider uppercase
                text-[#8C2F4D] dark:text-[#E5C583]
                hover:underline transition-all
              "
            >
              <span>Explore All</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Products Grid with Cinematic Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-start">

          {/* Cinematic Hero Feature Card with Arch Top */}
          <div
            className="
              sm:col-span-2
              relative
              rounded-t-[44px] rounded-b-[26px]
              overflow-hidden
              min-h-[480px] sm:min-h-[520px] lg:min-h-[580px]
              border-2 border-[#D4B483]/60 dark:border-[#E5C583]/40
              shadow-[0_20px_50px_rgba(109,24,48,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)]
              group
            "
          >
            {/* Background Video or Fallback Image */}
            {featuredSection?.videoUrl ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              >
                <source src={featuredSection.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A1020] via-[#2F0B15] to-[#120408]" />
            )}

            {/* Editorial Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 group-hover:from-black/90 transition-colors duration-500" />

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 text-white z-10">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-[#D4B483] text-[#FAF6F0] text-[10px] tracking-[2.5px] uppercase px-3.5 py-1.5 rounded-full font-semibold">
                  <Sparkles size={11} className="text-[#D4B483]" />
                  ETHNIQUE ATELIER
                </span>
                <span className="text-[11px] tracking-widest text-[#E5C583] uppercase font-serif">
                  Curated Series
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight text-white drop-shadow-md">
                  {featuredSection?.title || "Pure Cotton Collection"}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-gray-200 font-light max-w-md leading-relaxed line-clamp-3">
                  {featuredSection?.subtitle || "Timeless drapes styled with breathable yarns, celebrating Jayant Saree Center's trusted ethnic legacy."}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={featuredSection?.buttonLink || "/products"}
                    className="
                      inline-flex items-center gap-2
                      bg-[#FAF6F0] text-[#2B2523]
                      hover:bg-[#E5C583] hover:text-black
                      border border-[#D4B483]
                      px-6 py-3 rounded-full
                      text-xs font-semibold tracking-wider uppercase
                      shadow-lg transition-all duration-300
                      hover:scale-105 active:scale-95
                    "
                  >
                    <span>{featuredSection?.buttonText || "Discover Collection"}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Saree Product Cards with Arched Tops */}
          {(filteredProducts.length > 0 ? filteredProducts : products).slice(0, 6).map((product) => {
            const inWishlist = isProductInWishlist(product._id);
            const isAdded = addedAnimId === product._id;
            const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

            return (
              <div
                key={product._id}
                className={`
                  group relative
                  bg-white dark:bg-[#18101C]
                  rounded-t-[38px] rounded-b-[22px]
                  overflow-hidden
                  border ${isOutOfStock ? "border-red-200 dark:border-red-950/60 opacity-90" : "border-[#E8DFD3] dark:border-[#2C1F32]"}
                  hover:border-[#D4B483] dark:hover:border-[#E5C583]
                  shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                  hover:shadow-[0_20px_45px_rgba(109,24,48,0.14)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]
                  hover:-translate-y-2
                  transition-all duration-500 flex flex-col justify-between
                `}
              >
                <Link to={`/products/${product._id}`} className="block">
                  {/* Image Container with Arched Top */}
                  <div className="relative h-[380px] sm:h-[400px] overflow-hidden bg-[#FAF6F0] dark:bg-[#1D1322] rounded-t-[36px]">
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

                    {/* Craft / Sold Out Tag Badge */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
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

                  {/* Card Information */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium tracking-[2px] uppercase text-[#8C2F4D] dark:text-[#E5C583]">
                        Designer Edit
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
                      {product.highlight || "Pure breathable drape with elegant motifs."}
                    </p>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#F0EAE1] dark:border-[#261D2B]">
                      <span className="font-serif text-xl font-bold text-[#2B2523] dark:text-[#F7F2EC]">
                        {formatPrice ? formatPrice(product.priceINR) : `₹${product.priceINR}`}
                      </span>

                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gray-100 dark:bg-[#201525] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-[#38283E] cursor-not-allowed"
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
                </Link>
              </div>
            );
          })}

        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="
              relative bg-white dark:bg-[#18101C]
              max-w-2xl w-full rounded-3xl overflow-hidden
              border border-[#D4B483] shadow-2xl
              grid grid-cols-1 md:grid-cols-2
              animate-fadeIn
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[320px] md:h-[420px] bg-[#FAF6F0] dark:bg-[#1D1322]">
              <img
                src={quickViewProduct.images?.[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
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
                <h3 className="font-serif text-2xl text-[#2B2523] dark:text-[#F7F2EC] mt-2">
                  {quickViewProduct.name}
                </h3>
                <p className="text-2xl font-bold font-serif text-[#6D1830] dark:text-[#E5C583] mt-3">
                  {formatPrice ? formatPrice(quickViewProduct.priceINR) : `₹${quickViewProduct.priceINR}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  {quickViewProduct.description || quickViewProduct.highlight || "Curated designer saree, finished with elegant motifs and comfortable all-day drape."}
                </p>
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
                    className="flex-1 bg-[#6D1830] hover:bg-[#8C2F4D] text-white py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={15} />
                    <span>Add To Bag</span>
                  </button>
                )}
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-[#201426] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SareeSection;