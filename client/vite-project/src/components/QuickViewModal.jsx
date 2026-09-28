import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Sparkles,
  Check,
  Move,
  ShieldCheck,
  Truck,
  Eye,
  Scan,
} from "lucide-react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/Wishlistcontext";
import { CartContext } from "../context/CartContext";
import { CountryContext } from "../context/CoutryContext";
import toast from "react-hot-toast";

/**
 * Extracts and consolidates all valid images for a product.
 * Guarantees that any images in `product.images` (and `product.image`)
 * are surfaced cleanly without duplicates or empty values.
 */
export function getProductImages(product) {
  if (!product) return [];
  const list = [];

  // 1. Process array of images
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (typeof img === "string" && img.trim().length > 0) {
        const clean = img.trim();
        if (!list.includes(clean)) list.push(clean);
      }
    });
  }

  // 2. Process singular image property if distinct
  if (typeof product.image === "string" && product.image.trim().length > 0) {
    const clean = product.image.trim();
    if (!list.includes(clean)) list.push(clean);
  }

  // 3. Graceful fallback if no valid image found
  if (list.length === 0) {
    list.push("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85");
  }

  return list;
}

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { formatPrice } = useContext(CountryContext);

  const images = getProductImages(product);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Creative Zoom States
  const [zoomLevel, setZoomLevel] = useState(1); // 1 to 3.5x
  const [zoomMode, setZoomMode] = useState("pan"); // "pan" or "lens"
  const [panPos, setPanPos] = useState({ x: 50, y: 50 }); // percentages (0-100)
  const [lensPos, setLensPos] = useState({ x: 50, y: 50, pixelX: 0, pixelY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const imageContainerRef = useRef(null);

  const isOutOfStock =
    product.inStock === false ||
    (product.stock !== undefined && Number(product.stock) <= 0);

  const inWishlist =
    Array.isArray(wishlist) &&
    wishlist.some((item) => (item._id || item.id) === product._id);

  // Reset zoom whenever switching images
  const changeImage = useCallback((newIdx) => {
    setSelectedIdx(newIdx);
    setZoomLevel(1);
    setPanPos({ x: 50, y: 50 });
  }, []);

  // Prevent background scroll when QuickView is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        changeImage((selectedIdx > 0 ? selectedIdx - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        changeImage((selectedIdx < images.length - 1 ? selectedIdx + 1 : 0));
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isFullscreen, selectedIdx, images.length, changeImage]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3.5, +(prev + 0.6).toFixed(1)));
    setShowHint(false);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(1, +(prev - 0.6).toFixed(1));
      if (next === 1) setPanPos({ x: 50, y: 50 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 50, y: 50 });
  };

  // Double Click toggles zoom between 1x and 2.2x at clicked position
  const handleDoubleClick = (e) => {
    if (!imageContainerRef.current) return;
    setShowHint(false);
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setPanPos({ x: xPercent, y: yPercent });
      setZoomLevel(2.2);
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (!imageContainerRef.current) return;
    e.preventDefault();
    setShowHint(false);

    const delta = e.deltaY < 0 ? 0.3 : -0.3;
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.min(3.5, +(prev + delta).toFixed(1)));
      if (next === 1) setPanPos({ x: 50, y: 50 });
      return next;
    });

    if (e.deltaY < 0) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setPanPos({ x: xPercent, y: yPercent });
    }
  };

  // Mouse Move over image container
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;
    const xPercent = Math.max(0, Math.min(100, (pixelX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (pixelY / rect.height) * 100));

    setLensPos({ x: xPercent, y: yPercent, pixelX, pixelY });

    if (zoomLevel > 1 && zoomMode === "pan") {
      setPanPos({ x: xPercent, y: yPercent });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error("Sorry, this saree is currently out of stock!");
      return;
    }
    addToCart(product);
    setIsAddedToCart(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    toast.success(inWishlist ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const currentImage = images[selectedIdx] || images[0];

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ${
        isFullscreen ? "p-0" : ""
      }`}
      onClick={onClose}
    >
      <div
        className={`
          relative bg-white dark:bg-[#150F18]
          text-[#2B2523] dark:text-[#F7F2EC]
          w-full rounded-3xl shadow-2xl border border-[#D4B483]/50
          overflow-hidden flex flex-col md:flex-row
          transition-all duration-300 animate-fadeIn
          ${
            isFullscreen
              ? "h-full w-full rounded-none border-none max-w-none"
              : "max-w-5xl max-h-[92vh] overflow-y-auto md:overflow-hidden"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="
            absolute top-4 right-4 z-40 p-2.5 rounded-full
            bg-white/80 dark:bg-black/60 backdrop-blur-md
            text-gray-600 dark:text-gray-300 hover:text-[#8C2F4D] dark:hover:text-[#E5C583]
            border border-[#D4B483]/40 shadow-lg hover:scale-110 hover:rotate-90
            transition-all duration-300 cursor-pointer
          "
        >
          <X size={18} />
        </button>

        {/* ================================================= */}
        {/* LEFT COLUMN: INTERACTIVE CREATIVE ZOOM & GALLERY */}
        {/* ================================================= */}
        <div
          className={`
            relative flex flex-col bg-[#FAF6F0] dark:bg-[#1A121F]
            border-b md:border-b-0 md:border-r border-[#E8DFD3] dark:border-[#2C1F32]
            ${isFullscreen ? "w-full md:w-3/5 h-full" : "w-full md:w-1/2"}
          `}
        >
          {/* Main Visual Stage */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              if (zoomLevel === 1) setPanPos({ x: 50, y: 50 });
            }}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            className={`
              relative w-full h-[360px] sm:h-[440px] md:h-[500px] overflow-hidden select-none
              bg-[#F4ECE1]/60 dark:bg-[#140D18] flex items-center justify-center
              ${zoomLevel > 1 && zoomMode === "pan" ? "cursor-move" : "cursor-crosshair"}
            `}
          >
            {/* The Main Image with dynamic transform */}
            <img
              src={currentImage}
              alt={`${product.name} view ${selectedIdx + 1}`}
              style={{
                transformOrigin: `${panPos.x}% ${panPos.y}%`,
                transform: zoomMode === "pan" ? `scale(${zoomLevel})` : "scale(1)",
                transition: isHovering && zoomLevel > 1 ? "transform 0.08s ease-out" : "transform 0.3s ease-out",
              }}
              className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Creative Lens Mode Loupe Magnifier */}
            {zoomMode === "lens" && isHovering && (
              <div
                style={{
                  top: `${lensPos.pixelY - 90}px`,
                  left: `${lensPos.pixelX - 90}px`,
                  backgroundImage: `url(${currentImage})`,
                  backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                  backgroundSize: `${zoomLevel * 300}%`,
                  backgroundRepeat: "no-repeat",
                }}
                className="
                  pointer-events-none absolute w-44 h-44 rounded-full
                  border-3 border-[#D4B483] dark:border-[#E5C583]
                  shadow-[0_0_25px_rgba(212,180,131,0.55),0_12px_30px_rgba(0,0,0,0.5)]
                  z-30 overflow-hidden ring-4 ring-black/20
                "
              >
                {/* Crosshair indicator inside lens */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-6 h-[1px] bg-white" />
                  <div className="h-6 w-[1px] bg-white -ml-3" />
                </div>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[9px] text-[#E5C583] font-semibold tracking-wider uppercase">
                  {(zoomLevel * 1.5).toFixed(1)}x Loupe
                </div>
              </div>
            )}

            {/* Top Badges: Image Counter & Craft Tag */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider border border-white/10 shadow-sm flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#E5C583]" />
                <span>
                  {selectedIdx + 1} / {images.length} {images.length > 1 ? "Views" : "View"}
                </span>
              </span>

              {zoomLevel > 1 && (
                <span className="px-2.5 py-1 rounded-full bg-[#8C2F4D] dark:bg-[#E5C583] text-white dark:text-[#18101C] text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1 animate-pulse">
                  <Scan size={10} />
                  <span>Zoom {Math.round(zoomLevel * 100)}%</span>
                </span>
              )}
            </div>

            {/* Double-click / Scroll Hint Pill */}
            {showHint && zoomLevel === 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white/95 text-[10px] font-medium tracking-wide shadow-lg border border-white/15 flex items-center gap-1.5 animate-bounce">
                  <span>💡 Double-click or scroll wheel to zoom</span>
                </div>
              </div>
            )}

            {/* Left / Right Carousel Arrow Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous saree image"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeImage(selectedIdx > 0 ? selectedIdx - 1 : images.length - 1);
                  }}
                  className="
                    absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full
                    bg-white/80 dark:bg-black/60 hover:bg-[#8C2F4D] dark:hover:bg-[#E5C583]
                    text-gray-800 dark:text-gray-100 hover:text-white dark:hover:text-[#18101C]
                    backdrop-blur-md border border-[#D4B483]/40 shadow-lg
                    transition-all duration-200 hover:scale-110 cursor-pointer
                  "
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  aria-label="Next saree image"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeImage(selectedIdx < images.length - 1 ? selectedIdx + 1 : 0);
                  }}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full
                    bg-white/80 dark:bg-black/60 hover:bg-[#8C2F4D] dark:hover:bg-[#E5C583]
                    text-gray-800 dark:text-gray-100 hover:text-white dark:hover:text-[#18101C]
                    backdrop-blur-md border border-[#D4B483]/40 shadow-lg
                    transition-all duration-200 hover:scale-110 cursor-pointer
                  "
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Floating Zoom & Inspection Creative Control Bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-[#18101C]/90 backdrop-blur-md border border-[#D4B483]/60 shadow-xl">
              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={zoomLevel <= 1}
                title="Zoom Out (-)"
                className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-[#8C2F4D] hover:text-white dark:hover:bg-[#E5C583] dark:hover:text-black disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ZoomOut size={15} />
              </button>

              {/* Current Zoom Percentage */}
              <span className="px-2 text-[11px] font-bold font-mono tracking-tight text-[#8C2F4D] dark:text-[#E5C583] min-w-[46px] text-center select-none">
                {Math.round(zoomLevel * 100)}%
              </span>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={zoomLevel >= 3.5}
                title="Zoom In (+)"
                className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-[#8C2F4D] hover:text-white dark:hover:bg-[#E5C583] dark:hover:text-black disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ZoomIn size={15} />
              </button>

              {/* Reset Zoom Button */}
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetZoom();
                  }}
                  title="Reset Zoom to 100%"
                  className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
              )}

              <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-0.5" />

              {/* Lens Mode vs Pan Mode Switcher */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomMode((prev) => (prev === "pan" ? "lens" : "pan"));
                  if (zoomMode === "pan" && zoomLevel === 1) setZoomLevel(1.8);
                }}
                title={zoomMode === "lens" ? "Switch to Pan Mode" : "Switch to Loupe Lens Mode"}
                className={`p-1.5 rounded-full transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2 ${
                  zoomMode === "lens"
                    ? "bg-[#8C2F4D] text-white dark:bg-[#E5C583] dark:text-black"
                    : "text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                <Eye size={13} />
                <span className="hidden sm:inline">{zoomMode === "lens" ? "Lens" : "Inspect"}</span>
              </button>

              {/* Fullscreen Expansion Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen((prev) => !prev);
                }}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Theatre"}
                className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

            {/* Mini Radar / Viewfinder Map when Zoomed In */}
            {zoomLevel > 1.2 && zoomMode === "pan" && (
              <div className="absolute top-4 right-4 z-20 w-20 h-26 rounded-xl overflow-hidden border-2 border-[#D4B483] bg-black/60 shadow-2xl backdrop-blur-md hidden sm:block">
                <img src={currentImage} alt="Radar Preview" className="w-full h-full object-cover opacity-60" />
                <div
                  style={{
                    top: `${Math.max(0, Math.min(65, panPos.y - 18))}%`,
                    left: `${Math.max(0, Math.min(60, panPos.x - 20))}%`,
                    width: `${Math.max(25, 100 / zoomLevel)}%`,
                    height: `${Math.max(25, 100 / zoomLevel)}%`,
                  }}
                  className="absolute border-2 border-[#E5C583] bg-[#E5C583]/30 pointer-events-none rounded-sm transition-all duration-75"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-[#E5C583] uppercase tracking-wider py-0.5">
                  Navigator
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row: Display all saree images */}
          <div className="p-3 bg-white/70 dark:bg-[#120B15]/70 border-t border-[#E8DFD3] dark:border-[#2C1F32]">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Saree Gallery ({images.length} {images.length === 1 ? "Image" : "Images"})
              </span>
              <span className="text-[10px] text-[#8C2F4D] dark:text-[#E5C583] font-medium">
                Click thumbnail to switch view
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => changeImage(idx)}
                  className={`
                    relative w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all duration-200
                    ${
                      selectedIdx === idx
                        ? "border-[#8C2F4D] dark:border-[#E5C583] scale-105 shadow-md ring-2 ring-[#D4B483]/40"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                    }
                  `}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono font-bold">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT COLUMN: SAREE DETAILS & COMMERCE ACTIONS */}
        {/* ================================================= */}
        <div
          className={`
            p-6 sm:p-8 flex flex-col justify-between overflow-y-auto
            ${isFullscreen ? "w-full md:w-2/5 h-full" : "w-full md:w-1/2"}
          `}
        >
          <div>
            {/* Header badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] tracking-[2.5px] uppercase text-[#8C2F4D] dark:text-[#E5C583] font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#D4B483]" />
                Jayant Saree Center &bull; Exclusive
              </span>

              {isOutOfStock ? (
                <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/50">
                  Sold Out
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock &bull; Ready to Ship
                </span>
              )}
            </div>

            {/* Saree Title */}
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2523] dark:text-[#F7F2EC] mt-3 font-semibold capitalize leading-snug">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2F4D] dark:text-[#E5C583]">
                {formatPrice ? formatPrice(product.priceINR) : `₹${product.priceINR}`}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                (Inclusive of all taxes & insurance)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed font-light">
              {product.description ||
                product.highlight ||
                "Handcrafted luxury drape curated from Jayant Saree Center. Woven with rich traditional motifs, intricate border patterns, and graceful all-day comfort."}
            </p>

            {/* Key Specifications Grid */}
            <div className="mt-5 p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#1D1322] border border-[#E8DFD3]/80 dark:border-[#2C1F32] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">
                  Fabric Weave
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
                  {product.fabric || "Pure Cotton Handloom"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">
                  Color Shade
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate capitalize">
                  {product.color || "Heritage Crimson Red"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">
                  Saree Length
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
                  {product.sareeLength || "5.5 Meters Standard"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase tracking-wider">
                  Blouse Piece
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block truncate">
                  {product.blouse || "Included (0.8m Unstitched)"}
                </span>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="mt-5 space-y-2 border-t border-gray-100 dark:border-[#281D2E] pt-4">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                <ShieldCheck size={15} className="text-[#8C2F4D] dark:text-[#E5C583] flex-shrink-0" />
                <span>100% Certified Authentic Handloom & Master Craftsmanship</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                <Truck size={15} className="text-[#8C2F4D] dark:text-[#E5C583] flex-shrink-0" />
                <span>Complimentary Insured Doorstep Delivery across India</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#2C1F32] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Add to Bag Button */}
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 py-3.5 rounded-full bg-gray-200 dark:bg-[#201525] text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider cursor-not-allowed text-center"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`
                    flex-1 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-98
                    ${
                      isAddedToCart
                        ? "bg-emerald-600 text-white"
                        : "bg-[#8C2F4D] hover:bg-[#6D1830] text-white shadow-[#8C2F4D]/25 hover:shadow-xl"
                    }
                  `}
                >
                  {isAddedToCart ? (
                    <>
                      <Check size={16} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>Add To Bag</span>
                    </>
                  )}
                </button>
              )}

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label="Wishlist"
                className={`
                  p-3.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer hover:scale-105
                  ${
                    inWishlist
                      ? "bg-[#8C2F4D] text-white border-[#8C2F4D]"
                      : "bg-[#FAF6F0] dark:bg-[#1D1322] border-[#E8DFD3] dark:border-[#38283E] text-gray-600 dark:text-gray-300 hover:text-[#8C2F4D] dark:hover:text-[#E5C583]"
                  }
                `}
              >
                <Heart size={18} className={inWishlist ? "fill-white" : ""} />
              </button>
            </div>

            {/* View Full Product Details Link */}
            <div className="flex items-center gap-3">
              <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full border border-[#D4B483] text-[#8C2F4D] dark:text-[#E5C583] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF6F0] dark:hover:bg-[#201426] transition text-center"
              >
                View Full Drape Details & Styling Guide
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#201426] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
