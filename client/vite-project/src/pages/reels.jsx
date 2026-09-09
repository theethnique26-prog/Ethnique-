import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ShoppingBag,
  Sparkles,
  Eye,
  Check,
  Award,
  Scissors,
  Layers,
  Compass,
  ArrowRight,
  Flame,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../services/apiConfig.js";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/Wishlistcontext";
import { CountryContext } from "../context/CoutryContext";
import toast from "react-hot-toast";

// Curated luxury stories to complement backend reels so the gallery is rich, full & editorial
// Curated luxury stories to complement backend reels so the gallery is rich, full & editorial
const CURATED_LOOKBOOK_STORIES = [
  {
    _id: "curated-reel-1",
    title: "Pure Cotton Saree Draping Masterclass",
    category: "Drape & Styling",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1788963902/reel6mp4_ilymwe.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_1/reel6mp4_ilymwe.jpg",
    views: "38.4K",
    duration: "0:22",
    likes: 1840,
    featuredProduct: {
      _id: "6a49da9194721e57d49db3cc",
      name: "Grey cotton saree",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783224920/poroduct10.1_rnqfuz.png",
      fabric: "Pure Cotton Saree",
    },
    description: "Step-by-step pleated draping with clean pallu tucks for everyday royal poise.",
  },
  {
    _id: "curated-reel-2",
    title: "Crimson Bridal Zari Unveiling",
    category: "Festive & Bridal",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1788963723/reel2_rir5qt.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_1/reel2_rir5qt.jpg",
    views: "52.1K",
    duration: "0:49",
    likes: 2980,
    featuredProduct: {
      _id: "6a4927add2023479666d8133",
      name: "red saree",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1782968060/Copilot_20260507_213419_jkkdlm.png",
      fabric: "Bridal Zari Silk",
    },
    description: "Grand bridal border reveal tailored for weddings, receptions, and regal entryways.",
  },
  {
    _id: "curated-reel-3",
    title: "Chanderi Mustard Festive Drape",
    category: "Festive & Bridal",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1788963570/reel3_r62mcr.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_1/reel3_r62mcr.jpg",
    views: "29.8K",
    duration: "0:52",
    likes: 1480,
    featuredProduct: {
      _id: "6a49298cd2023479666d8137",
      name: "mustardyellow",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179607/product7.1_iyiq4d.png",
      fabric: "Chanderi Mustard Saree",
    },
    description: "Intimate studio lookbook showcasing subtle sheen and light-reflecting drape appeal.",
  },
  {
    _id: "curated-reel-4",
    title: "The Regal Olive Garden Drape",
    category: "Drape & Styling",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1783240227/Video3_dnuwun.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_2/Video3_dnuwun.jpg",
    views: "24.3K",
    duration: "0:16",
    likes: 1120,
    featuredProduct: {
      _id: "6a4929e3d2023479666d8139",
      name: "olive green",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179729/final_small_31019_2_qsp6j9.jpg",
      fabric: "Designer Silk Saree",
    },
    description: "Deep forest green elegance crafted for evening soirees and family festivities.",
  },
  {
    _id: "curated-reel-5",
    title: "Dual-Tone Sunset Saree Look",
    category: "Festive & Bridal",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1783240218/Video2_yeylvh.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_3/Video2_yeylvh.jpg",
    views: "34.6K",
    duration: "1:30",
    likes: 1670,
    featuredProduct: {
      _id: "6a4928c1d2023479666d8135",
      name: "brownandmagenta",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1782968020/Copilot_20260506_162938_j2r6mp.png",
      fabric: "Dual-Tone Designer Cotton",
    },
    description: "Rich sunset tones that bring festive grace to evening sangeet and celebrations.",
  },
  {
    _id: "curated-reel-6",
    title: "Soft Handwoven Artisan Drape",
    category: "Real Brides & Clients",
    videoUrl: "https://res.cloudinary.com/djs5fhvwd/video/upload/v1782491382/video1_ahtcir.mp4",
    thumbnail: "https://res.cloudinary.com/djs5fhvwd/video/upload/so_2/video1_ahtcir.jpg",
    views: "44.9K",
    duration: "0:31",
    likes: 2150,
    featuredProduct: {
      _id: "6a492652d2023479666d8129",
      name: "Soft Handwoven Cotton Saree",
      priceINR: 2499,
      image: "https://res.cloudinary.com/djs5fhvwd/image/upload/v1782967996/Copilot_20260506_155948_eqlcby.png",
      fabric: "Handwoven Pure Cotton",
    },
    description: "Sublime authentic craftsmanship direct from the looms of Varanasi and Maheshwar.",
  },
];

const CATEGORIES = [
  "All Stories",
  "Drape & Styling",
  "Festive & Bridal",
  "Real Brides & Clients",
];

function Reels() {
  const [backendReels, setBackendReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [selectedReel, setSelectedReel] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // Audible by default
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [addedCartId, setAddedCartId] = useState(null);
  const videoRef = React.useRef(null);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { formatPrice } = useContext(CountryContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReels();
  }, []);

  // Synchronize video player mute state and ensure audible playback on open
  useEffect(() => {
    if (selectedReel && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If browser policy rejects unmuted autoplay, fallback gracefully to muted
          console.warn("Browser blocked unmuted autoplay:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [selectedReel, isMuted]);

  const handleOpenReel = (reel) => {
    setSelectedReel(reel);
    setIsMuted(false); // User gesture triggers audible playback
    setIsPlaying(true);
  };

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reels`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reels)) {
        // Map backend reels with enhanced presentation metadata
        const formatted = data.reels.map((item, idx) => {
          const match = CURATED_LOOKBOOK_STORIES.find((c) => c.videoUrl === item.videoUrl);
          return {
            ...item,
            category: item.category || match?.category || (idx % 2 === 0 ? "Drape & Styling" : "Festive & Bridal"),
            views: item.views || match?.views || `${(24 + idx * 5.3).toFixed(1)}K`,
            duration: item.duration || match?.duration || "0:45",
            likes: item.likes || match?.likes || 1540 + idx * 120,
            featuredProduct: item.featuredProduct || match?.featuredProduct || {
              _id: "6a49da9194721e57d49db3cc",
              name: item.title || "Ethnique Designer Saree",
              priceINR: 2499,
              image: item.thumbnail || "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783224920/poroduct10.1_rnqfuz.png",
              fabric: "Designer Silk Saree",
            },
            description:
              item.description ||
              match?.description ||
              "Discover the authentic beauty and timeless grace of our signature Jayant Saree Center collection.",
          };
        });
        setBackendReels(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch reels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combine backend reels with curated stories, avoiding duplicates by videoUrl
  const allReels = useMemo(() => {
    const list = [...backendReels];
    const existingUrls = new Set(list.map((r) => r.videoUrl));
    CURATED_LOOKBOOK_STORIES.forEach((story) => {
      if (!existingUrls.has(story.videoUrl)) {
        list.push(story);
      }
    });
    return list;
  }, [backendReels]);

  // Filtered stories
  const filteredReels = useMemo(() => {
    if (selectedCategory === "All Stories") return allReels;
    return allReels.filter((r) => r.category === selectedCategory);
  }, [allReels, selectedCategory]);

  // Spotlight story is always the first reel
  const spotlightReel = allReels[0] || CURATED_LOOKBOOK_STORIES[0];

  const handleLikeToggle = (e, id) => {
    e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(!likedMap[id] ? "Saved to your inspiration board!" : "Removed from saved stories");
  };

  const handleShare = (e, reel) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Story link copied to clipboard!");
    } else {
      toast.success("Sharing Ethnique Lookbook story");
    }
  };

  const handleAddProductToCart = (e, product) => {
    e.stopPropagation();
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      priceINR: product.priceINR || 2499,
      images: product.image,
      fabric: product.fabric || "Pure Cotton",
    });
    setAddedCartId(product._id);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddedCartId(null), 1800);
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-500 pb-28">
      {/* 1. Grand Royal Atelier Header */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#D4B483]/15 via-[#6D1830]/10 to-[#D4B483]/15 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto">
          {/* Editorial Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4B483]/40 bg-[#D4B483]/10 backdrop-blur-md text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold mb-4 shadow-sm">
            <Sparkles size={13} className="text-[#B8860B] animate-pulse" />
            <span>Ethnique Living Lookbook • Cinematic Archive</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--text-primary)] tracking-tight font-medium">
            Reels & Video Lookbook
          </h1>

          <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Experience our curated sarees in motion. Discover drape tutorials, festive styling guides, and exclusive designs from Jayant Saree Center.
          </p>

          {/* Luxury Highlights Bar */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs tracking-wider uppercase text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Award size={14} className="text-[#B8860B]" />
              Jayant Saree Center Legacy
            </span>
            <span className="hidden sm:inline text-[#D4B483]/40">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Flame size={14} className="text-[#8C2F4D]" />
              HD Draping Masterclasses
            </span>
            <span className="hidden sm:inline text-[#D4B483]/40">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShoppingBag size={14} className="text-[#B8860B]" />
              Direct "Shop In Reel" Access
            </span>
          </div>
        </div>
      </section>

      {/* 2. Atelier Cinema Spotlight (Hero Story Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-[32px] sm:rounded-[40px] border border-[#D4B483]/30 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)] shadow-2xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-all duration-300">
          {/* Subtle Golden Ambient Ring */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4B483]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Cinema Video/Thumbnail Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => handleOpenReel(spotlightReel)}
                className="relative w-full max-w-[340px] aspect-[9/16] rounded-[28px] overflow-hidden group cursor-pointer shadow-2xl border-2 border-[#D4B483]/40 hover:border-[#8C2F4D] transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Image / Thumbnail */}
                <img
                  src={spotlightReel.thumbnail}
                  alt={spotlightReel.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Top Corner Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#E8C58D] border border-[#D4B483]/30 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={11} />
                    Atelier Spotlight
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs text-white/90 font-mono">
                    {spotlightReel.duration}
                  </span>
                </div>

                {/* Center Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#8C2F4D] to-[#6D1830] text-white p-0.5 shadow-2xl border-2 border-[#E8C58D]/70 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(212,180,131,0.5)] transition-all duration-300">
                    <Play size={32} fill="white" className="ml-1 text-white" />
                  </div>
                </div>

                {/* Bottom Card Preview Information */}
                <div className="absolute bottom-5 inset-x-5 text-white z-10">
                  <span className="text-xs uppercase tracking-widest text-[#E8C58D] font-medium block mb-1">
                    {spotlightReel.category}
                  </span>
                  <h3 className="text-lg font-serif font-medium line-clamp-2 leading-snug">
                    {spotlightReel.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-white/80">
                    <span>{spotlightReel.views} views</span>
                    <span className="text-[#E8C58D] font-medium underline underline-offset-2">
                      Tap to watch HD reel
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative & Linked Product */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold flex items-center gap-2">
                  <Compass size={14} />
                  Featured Story Archive
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] mt-2 font-medium leading-tight">
                  {spotlightReel.title}
                </h2>
                <p className="mt-3 text-[var(--text-muted)] text-base leading-relaxed">
                  {spotlightReel.description}
                </p>
              </div>

              {/* Tagged Saree Card ("Shop This Look") */}
              {spotlightReel.featuredProduct && (
                <div className="rounded-2xl border border-[#D4B483]/30 bg-[var(--bg-primary)]/80 backdrop-blur-md p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={spotlightReel.featuredProduct.image}
                    alt={spotlightReel.featuredProduct.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-[#D4B483]/30 shadow-inner flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider text-[#B8860B] font-semibold">
                      Featured In This Reel
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-medium text-[var(--text-primary)] mt-0.5 capitalize">
                      {spotlightReel.featuredProduct.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {spotlightReel.featuredProduct.fabric}
                    </p>
                    <div className="mt-2 text-base font-semibold text-[#8C2F4D] dark:text-[#E8C58D]">
                      {formatPrice(spotlightReel.featuredProduct.priceINR || 2499)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button
                      onClick={(e) => handleAddProductToCart(e, spotlightReel.featuredProduct)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      {addedCartId === spotlightReel.featuredProduct._id ? (
                        <>
                          <Check size={14} className="text-[#E8C58D]" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add to Bag
                        </>
                      )}
                    </button>
                    <Link
                      to={`/product/${spotlightReel.featuredProduct._id}`}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-[#D4B483]/50 text-[var(--text-primary)] hover:border-[#8C2F4D] text-xs font-medium text-center transition flex items-center justify-center gap-1"
                    >
                      <span>View Saree</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setSelectedReel(spotlightReel)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8C2F4D] to-[#6D1830] text-white text-sm font-semibold uppercase tracking-widest shadow-xl hover:shadow-[#6D1830]/30 hover:scale-[1.02] transition flex items-center gap-2"
                >
                  <Play size={16} fill="white" />
                  Watch in High Definition
                </button>
                <button
                  onClick={(e) => handleShare(e, spotlightReel)}
                  className="px-5 py-3 rounded-full border border-[#D4B483]/40 bg-[var(--card-bg)] hover:border-[#8C2F4D] text-[var(--text-primary)] text-sm font-medium transition flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D4B483]/20 pb-5">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "All Stories"
                  ? allReels.length
                  : allReels.filter((r) => r.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 flex-shrink-0 flex items-center gap-1.5
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-white shadow-md scale-105 border border-[#D4B483]/50"
                        : "bg-[var(--card-bg)] border border-[#D4B483]/30 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[#8C2F4D]"
                    }
                  `}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Counter text */}
          <div className="text-xs text-[var(--text-muted)] tracking-wider">
            Showing <span className="font-semibold text-[#8C2F4D] dark:text-[#E8C58D]">{filteredReels.length}</span> Living Lookbook Stories
          </div>
        </div>
      </section>

      {/* 4. Reels Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#8C2F4D] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-[var(--text-muted)] font-serif">
              Loading Living Lookbook...
            </p>
          </div>
        ) : filteredReels.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border border-[#D4B483]/30 max-w-md mx-auto p-8 shadow-sm">
            <Play size={44} className="mx-auto text-gray-400 mb-3 opacity-60" />
            <h3 className="text-xl font-serif font-medium text-[var(--text-primary)]">
              No Stories Found
            </h3>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              No stories match "{selectedCategory}". Explore our other draping archives.
            </p>
            <button
              onClick={() => setSelectedCategory("All Stories")}
              className="mt-5 px-5 py-2 rounded-full bg-[#6D1830] text-white text-xs uppercase tracking-wider hover:brightness-110 transition"
            >
              View All Stories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredReels.map((reel) => {
              const isLiked = !!likedMap[reel._id];

              return (
                <div
                  key={reel._id}
                  onClick={() => handleOpenReel(reel)}
                  className="
                    group
                    relative
                    h-[490px]
                    rounded-t-[34px]
                    rounded-b-[22px]
                    overflow-hidden
                    cursor-pointer
                    shadow-xl
                    border border-[#D4B483]/30
                    hover:border-[#8C2F4D]
                    transition-all duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                    bg-[var(--card-bg)]
                  "
                >
                  {/* Thumbnail Image */}
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-105
                    "
                    loading="lazy"
                  />

                  {/* Editorial Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/15 group-hover:from-black/95 group-hover:via-black/25 transition duration-300" />

                  {/* Top Bar: Category Pill + Duration + Like Button */}
                  <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#E8C58D] border border-[#D4B483]/30 uppercase tracking-wider">
                      {reel.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-white/90 font-mono">
                        {reel.duration}
                      </span>
                      <button
                        onClick={(e) => handleLikeToggle(e, reel._id)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition ${
                          isLiked
                            ? "bg-[#8C2F4D] text-white"
                            : "bg-black/50 text-white hover:bg-[#8C2F4D]/70"
                        }`}
                        title="Save Story"
                      >
                        <Heart size={14} fill={isLiked ? "white" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Center Glowing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        bg-white/20
                        backdrop-blur-md
                        border border-white/40
                        flex
                        items-center
                        justify-center
                        group-hover:scale-115
                        group-hover:bg-[#8C2F4D]
                        group-hover:border-[#E8C58D]
                        transition-all duration-300
                        shadow-xl
                      "
                    >
                      <Play size={22} fill="white" color="white" className="ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-4 inset-x-4 text-white z-10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span className="text-[#E8C58D] uppercase tracking-widest font-semibold text-[10px]">
                        Ethnique Lookbook
                      </span>
                      <span>{reel.views} views</span>
                    </div>

                    <h3 className="text-base font-serif font-medium leading-snug line-clamp-2 text-white group-hover:text-[#E8C58D] transition-colors">
                      {reel.title}
                    </h3>

                    {/* Quick Tagged Saree Pill */}
                    {reel.featuredProduct && (
                      <div
                        onClick={(e) => handleAddProductToCart(e, reel.featuredProduct)}
                        className="
                          mt-2
                          w-full
                          px-3
                          py-2
                          rounded-xl
                          bg-white/15
                          hover:bg-white/25
                          backdrop-blur-md
                          border border-white/20
                          flex
                          items-center
                          justify-between
                          text-xs
                          transition
                          duration-200
                        "
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <ShoppingBag size={12} className="text-[#E8C58D] flex-shrink-0" />
                          <span className="truncate text-white font-light text-[11px]">
                            Shop: {reel.featuredProduct.name}
                          </span>
                        </div>
                        <span className="text-[#E8C58D] font-semibold text-[11px] flex-shrink-0 ml-2">
                          {formatPrice(reel.featuredProduct.priceINR || 2499)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. "Shop The Lookbook Sarees" Product Rail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-[32px] border border-[#D4B483]/30 bg-[var(--card-bg)] p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#8C2F4D] dark:text-[#E8C58D] text-xs uppercase tracking-[0.25em] font-semibold">
                Direct From The Videos
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-medium mt-1">
                Shop The Sarees In Our Reels
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Every saree seen in our living lookbook is curated and available in exclusive retail batches by Jayant Saree Center.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C2F4D] dark:text-[#E8C58D] hover:underline"
            >
              <span>Explore All Sarees</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CURATED_LOOKBOOK_STORIES.slice(0, 6).map((story) => {
              const product = story.featuredProduct;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="group rounded-2xl border border-[#D4B483]/30 bg-[var(--bg-primary)] p-2.5 transition duration-300 hover:border-[#8C2F4D] hover:shadow-md flex flex-col justify-between"
                >
                  <div
                    onClick={() => handleOpenReel(story)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[var(--bg-secondary)] relative group/img">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-[#E8C58D] font-medium flex items-center gap-1 border border-white/20 shadow-md">
                          <Play size={10} fill="currentColor" /> Watch Reel
                        </span>
                      </div>
                    </div>
                    <h4 className="text-xs font-serif font-medium text-[var(--text-primary)] line-clamp-1 capitalize">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">
                      {product.fabric}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#D4B483]/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8C2F4D] dark:text-[#E8C58D]">
                      {formatPrice(product.priceINR)}
                    </span>
                    <button
                      onClick={(e) => handleAddProductToCart(e, product)}
                      className="p-1.5 rounded-lg bg-[#6D1830] text-white hover:brightness-110 transition"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Instagram Community & Share Drape Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] border border-[#D4B483]/40 bg-gradient-to-r from-[#6D1830] via-[#8C2F4D] to-[#6D1830] text-white p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] uppercase tracking-widest text-[#E8C58D] border border-white/20">
              <FaInstagram size={13} />
              Instagram Community
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif font-medium">
              Share Your Ethnique Drape Story
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Adorned in an Ethnique saree? Tag{" "}
              <span className="text-[#E8C58D] font-medium">@EthniqueByJayant</span> on Instagram with{" "}
              <span className="text-[#E8C58D] font-medium">#EthniqueWomen</span> to be featured in our Living Lookbook archive.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E8C58D] to-[#D4B483] text-[#6D1830] font-semibold text-xs uppercase tracking-widest shadow-xl hover:brightness-105 transition flex items-center gap-2"
              >
                <FaInstagram size={15} />
                Follow @EthniqueByJayant
              </a>
              <Link
                to="/products"
                className="px-6 py-3 rounded-full border border-white/30 hover:border-white text-white font-medium text-xs uppercase tracking-widest transition"
              >
                Explore Saree Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIP Cinema Modal Player */}
      {selectedReel && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setSelectedReel(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md h-[88dvh] sm:h-[90vh] max-h-[760px] bg-black rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-[#D4B483]/40 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Control Bar */}
            <div className="absolute top-4 inset-x-4 z-30 flex justify-between items-center">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs tracking-wider text-[#E8C58D] border border-white/10 flex items-center gap-1.5 font-medium">
                <Sparkles size={12} />
                Ethnique Lookbook
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextMuted = !isMuted;
                    setIsMuted(nextMuted);
                    if (videoRef.current) {
                      videoRef.current.muted = nextMuted;
                      videoRef.current.volume = 1.0;
                    }
                    toast.success(nextMuted ? "Sound muted" : "Sound on 🔊", { id: "audio-state", duration: 1200 });
                  }}
                  className={`px-3.5 py-1.5 rounded-full backdrop-blur-md text-white flex items-center gap-1.5 transition border text-xs font-medium shadow-md ${
                    !isMuted
                      ? "bg-[#6D1830]/90 border-[#E8C58D]/80 text-[#E8C58D] shadow-[#6D1830]/60 ring-2 ring-[#E8C58D]/30"
                      : "bg-black/70 border-white/20 hover:bg-white/20 text-white/90"
                  }`}
                  aria-label="Toggle mute"
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={16} className="text-red-300" />
                      <span className="text-[11px] font-medium tracking-wide">Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} className="text-[#E8C58D] animate-pulse" />
                      <span className="text-[11px] font-semibold text-[#E8C58D] tracking-wide">Sound On 🔊</span>
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => handleShare(e, selectedReel)}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition border border-white/10"
                  aria-label="Share story"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedReel(null)}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition border border-white/10"
                  aria-label="Close reel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={selectedReel.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                controls={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover cursor-pointer"
                onClick={(e) => {
                  const v = e.currentTarget;
                  if (v.paused) {
                    v.play();
                    setIsPlaying(true);
                  } else {
                    v.pause();
                    setIsPlaying(false);
                  }
                }}
              />

              {/* Center Play/Pause Overlay Indicator if paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Play size={28} fill="white" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Saree Drawer & Title Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 z-20 space-y-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#E8C58D] font-semibold">
                  {selectedReel.category} • {selectedReel.views} views
                </span>
                <h4 className="text-base sm:text-lg font-serif font-medium text-white line-clamp-1 mt-0.5">
                  {selectedReel.title}
                </h4>
              </div>

              {/* Tagged Saree Quick-Buy Drawer */}
              {selectedReel.featuredProduct && (
                <div className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={selectedReel.featuredProduct.image}
                      alt={selectedReel.featuredProduct.name}
                      className="w-12 h-14 object-cover rounded-lg border border-white/20 flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-serif font-medium text-white truncate capitalize">
                        {selectedReel.featuredProduct.name}
                      </p>
                      <p className="text-[11px] text-[#E8C58D] font-semibold">
                        {formatPrice(selectedReel.featuredProduct.priceINR || 2499)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddProductToCart(e, selectedReel.featuredProduct)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#8C2F4D] to-[#6D1830] text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-md transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <ShoppingBag size={13} />
                    <span>Add to Bag</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reels;