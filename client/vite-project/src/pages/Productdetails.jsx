import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../services/apiConfig.js";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/Wishlistcontext";
import { useLoyalty } from "../context/LoyaltyContext";
import {
  Heart,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Crown,
  Scissors,
  ArrowLeft,
  Share2,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { points } = useLoyalty();

  const inWishlist = wishlist?.some((item) => item._id === id);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products/${id}`);
      const data = await response.json();

      if (response.ok && data.product) {
        setProduct(data.product);
      } else {
        toast.error("Product not found");
        navigate("/products");
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = product?.inStock === false || (product?.stock !== undefined && Number(product?.stock) <= 0);

  const handleAddToCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      toast.error("This saree is currently out of stock.");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAddedToCart(true);
    toast.success(`${product.name} added to your shopping bag!`, {
      icon: "🛍️",
      duration: 3000,
    });
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast("Removed from your wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to your wishlist", { icon: "❤️" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Ethnique by Jayant Saree Center",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F5] dark:bg-[#120B15]">
        <div className="w-12 h-12 border-3 border-[#8B1E3F] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-serif text-sm tracking-widest text-[#8B1E3F] dark:text-[#E5C583] uppercase">
          Curating Saree Details...
        </p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179793/product8.1_w6x0lq.png"];

  const clanPointsEarned = Math.max(1, Math.floor(product.priceINR / 10));

  return (
    <div className="bg-[#FAF7F5] dark:bg-[#120B15] min-h-screen text-[var(--text-primary)] transition-colors duration-400 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 font-light">
          <Link to="/" className="hover:text-[#8B1E3F] dark:hover:text-[#E5C583] transition">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[#8B1E3F] dark:hover:text-[#E5C583] transition">
            Drapes Collection
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#8B1E3F] dark:text-[#E5C583] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ================================================= */}
          {/* LEFT: GALLERY WITH THUMBNAIL SELECTOR */}
          {/* ================================================= */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[560px] pb-2 sm:pb-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-24 sm:w-20 sm:h-26 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-[#8B1E3F] dark:border-[#E5C583] shadow-md scale-102"
                        : "border-gray-200 dark:border-[#2C1F32] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Interactive Stage */}
            <div className="flex-1 relative rounded-[32px] overflow-hidden bg-white dark:bg-[#18101C] border border-[#E8DFD3] dark:border-[#2C1F32] shadow-xl group">
              <div className="aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Badges Overlay */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                {isOutOfStock ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white text-[11px] uppercase tracking-[2px] font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Sold Out
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FAF6F0] border border-[#D4B483] text-[10px] uppercase tracking-[2px] font-semibold">
                    Jayant Saree Center
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#8B1E3F]/90 dark:bg-[#E5C583]/90 text-white dark:text-black text-[10px] uppercase tracking-wider font-semibold shadow-sm w-fit">
                  Designer Edit
                </span>
              </div>

              {/* Wishlist & Share floating actions */}
              <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                  className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                    inWishlist
                      ? "bg-[#8B1E3F] text-white scale-110"
                      : "bg-white/85 dark:bg-[#18101C]/85 text-gray-700 dark:text-gray-200 hover:scale-110 hover:text-[#8B1E3F]"
                  }`}
                >
                  <Heart size={18} className={inWishlist ? "fill-white" : ""} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share Saree"
                  className="p-3 rounded-full bg-white/85 dark:bg-[#18101C]/85 text-gray-700 dark:text-gray-200 hover:scale-110 hover:text-[#8B1E3F] backdrop-blur-md transition-all shadow-md"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT: DETAILS, SPECS, ACTIONS */}
          {/* ================================================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[3px] uppercase text-[#8B1E3F] dark:text-[#E5C583] mb-2">
                <Sparkles size={14} />
                <span>Curated Heritage Saree</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF] leading-tight">
                {product.name}
              </h1>

              {/* Price & Taxes & Availability Badge */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#8B1E3F] dark:text-[#E5C583]">
                  {formatPrice(product.priceINR)}
                </span>

                {isOutOfStock ? (
                  <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold uppercase tracking-wider">
                    Currently Out of Stock
                  </span>
                ) : Number(product.stock) <= 5 ? (
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold">
                    Only {product.stock} pieces left!
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold">
                    In Stock • Ready to Dispatch
                  </span>
                )}

                <span className="text-xs text-gray-500 dark:text-gray-400 font-light block w-full mt-1">
                  Inclusive of all taxes &amp; pre-finished fall/pico
                </span>
              </div>

              {/* Clan Points Pill */}
              <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/40 text-xs text-amber-800 dark:text-amber-300 font-medium">
                <Crown size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Earn +{clanPointsEarned} Clan Points with this purchase</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              {product.description ||
                "A luxurious designer saree curated by Jayant Saree Center, meticulously finished with matching fall and delicate pico for a flawless drape at all your festive celebrations."}
            </p>

            {/* Saree Specifications Grid */}
            <div className="bg-white dark:bg-[#18101C] rounded-2xl p-5 border border-gray-100 dark:border-[#2C1F32] shadow-sm">
              <h3 className="text-xs uppercase tracking-[2px] font-semibold text-gray-400 mb-4">
                Drape Details & Craft
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Fabric</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {product.fabric || "Pure Premium Silk Blend"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Color</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {product.color || "Festive Jewel Tone"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Saree Length</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {product.sareeLength || "5.5 Metres (Standard)"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Blouse Piece</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {product.blouse || "Included (0.8m Unstitched)"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Fall & Pico</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1">
                    <Check size={12} /> Pre-Finished Ready
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Collection</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {product.collection || "Signature Festive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart Actions */}
            {isOutOfStock ? (
              <div className="space-y-3 pt-2">
                <div className="w-full py-4 px-5 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-left sm:text-center">
                  <div className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 font-serif font-bold text-base">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Currently Out of Stock
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-light leading-relaxed">
                    This exquisite drape from Jayant Saree Center is temporarily sold out. Our weavers will restock soon!
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-4 rounded-full bg-gray-200 dark:bg-[#25172A] text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-800"
                >
                  <ShoppingCart size={16} />
                  <span>Out of Stock • Unavailable</span>
                </button>

                <a
                  href={`https://wa.me/917387020612?text=${encodeURIComponent(
                    `Hello Ethnique Concierge (+91 73870 20612)! ✨\n\nI would like to inquire about restock or custom weaving for this saree:\n• Product: ${product.name}\n• Price: ₹${product.priceINR?.toLocaleString("en-IN")}\n• URL: ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Inquire Restock on WhatsApp (+91 73870 20612)</span>
                </a>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-200 dark:border-[#38283E] rounded-full bg-white dark:bg-[#18101C] px-3 py-1.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                      isAddedToCart
                        ? "bg-emerald-600 text-white"
                        : "bg-[#8B1E3F] hover:bg-[#721833] text-white shadow-[#8B1E3F]/25"
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <Check size={16} />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        <span>Add to Bag • {formatPrice(product.priceINR * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    navigate("/checkout");
                  }}
                  className="w-full py-3.5 rounded-full border border-[#D4B483] bg-transparent hover:bg-[#D4B483]/10 text-[#8B1E3F] dark:text-[#E5C583] text-xs font-semibold uppercase tracking-wider transition duration-300"
                >
                  Instant Checkout
                </button>

                {/* Request Drape Video on WhatsApp */}
                <a
                  href={`https://wa.me/917387020612?text=${encodeURIComponent(
                    `Hello Ethnique Concierge (+91 73870 20612)! ✨\n\nI am interested in this saree:\n• Saree: ${product.name}\n• Price: ₹${product.priceINR?.toLocaleString("en-IN")}\n• URL: ${window.location.href}\n\nCould you please share drape videos, zari close-ups, or blouse styling options?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Request Drape Video on WhatsApp (+91 73870 20612)</span>
                </a>
              </div>
            )}

            {/* Jayant Saree Center Store Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-[#2C1F32]">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 dark:bg-[#18101C]/70 border border-gray-100 dark:border-[#2C1F32]">
                <Truck size={18} className="text-[#8B1E3F] dark:text-[#E5C583] flex-shrink-0" />
                <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                  Insured Express Delivery Across India
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 dark:bg-[#18101C]/70 border border-gray-100 dark:border-[#2C1F32]">
                <Scissors size={18} className="text-[#8B1E3F] dark:text-[#E5C583] flex-shrink-0" />
                <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                  Pre-Finished Fall & Pico Included
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 dark:bg-[#18101C]/70 border border-gray-100 dark:border-[#2C1F32]">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                  Jayant Saree Center 100% Quality Checked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;