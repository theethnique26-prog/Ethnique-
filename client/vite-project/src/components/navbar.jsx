import React, { useState, useContext, useRef, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import { useLoyalty } from "../context/LoyaltyContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Gift,
  Compass,
  Home,
  ShoppingBag,
  Crown,
  BookOpen,
  MessageCircle,
  Truck,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/Wishlistcontext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { points } = useLoyalty();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 250);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const cartCount = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <>
      {/* Top Royal Announcement Ribbon */}
      <div className="w-full bg-gradient-to-r from-[#380916] via-[#4A0E1F] to-[#380916] dark:from-[#110713] dark:via-[#1D0C22] dark:to-[#110713] text-[#F3E5D3] text-[11px] sm:text-xs tracking-[1.8px] uppercase py-2.5 px-4 text-center font-medium border-b border-[#D4B483]/35 transition-colors duration-400">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 sm:gap-4">
          <span className="text-[#D4B483] hidden sm:inline">✦</span>
          <span>Complimentary Insured Express Delivery Across India</span>
          <span className="text-[#D4B483] hidden md:inline">•</span>
          <span className="hidden md:inline">From The House of Jayant Saree Center</span>
          <span className="text-[#D4B483] hidden sm:inline">✦</span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className="
          w-full
          sticky
          top-0
          z-40
          transition-colors duration-400
          bg-[#FAF6F0]/92 dark:bg-[#0D080F]/92
          backdrop-blur-md
          border-b border-[#E8DFD3] dark:border-[#2C1F32]
          shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-6">

          {/* Left: Hamburger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="
                p-2 sm:p-2.5
                rounded-full
                text-[#2B2523] dark:text-[#F7F2EC]
                hover:bg-[#EFE6DA] dark:hover:bg-[#201426]
                hover:text-[#6D1830] dark:hover:text-[#E5C583]
                transition-all duration-300
                focus:outline-none
              "
            >
              <Menu size={22} className="sm:w-6 sm:h-6" />
            </button>

            {/* Crisp Vector Typography Logo */}
            <Link to="/" className="flex items-center group py-1">
              <BrandLogo />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links with Gold Flourish */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <NavItem to="/" label="Home" active={location.pathname === "/"} />
            <NavItem to="/products" label="Shop All" active={location.pathname === "/products"} />
            <NavItem to="/reels" label="Reels & Lookbook" active={location.pathname === "/reels"} />
            <NavItem to="/loyalty" label="Privilege Club" active={location.pathname === "/loyalty"} />
          </div>

          {/* Right: Actions (Wishlist, Cart, Profile, Theme Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3.5">

            {/* Wishlist Icon */}
            <button
              onClick={() => navigate("/wishlist")}
              aria-label="View Wishlist"
              className="
                relative p-2 sm:p-2.5
                rounded-full
                text-[#2B2523] dark:text-[#F7F2EC]
                hover:text-[#8C2F4D] dark:hover:text-[#E5C583]
                hover:bg-[#EFE6DA] dark:hover:bg-[#201426]
                transition-all duration-300
              "
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#8C2F4D] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              aria-label="View Shopping Cart"
              className="
                relative p-2 sm:p-2.5
                rounded-full
                text-[#2B2523] dark:text-[#F7F2EC]
                hover:text-[#8C2F4D] dark:hover:text-[#E5C583]
                hover:bg-[#EFE6DA] dark:hover:bg-[#201426]
                transition-all duration-300
              "
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#2B2523] dark:bg-[#E5C583] text-white dark:text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div
                ref={dropdownRef}
                className="relative hidden sm:block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  aria-expanded={userDropdownOpen}
                  aria-label="User account menu"
                  className={`
                    flex items-center gap-1.5 p-1.5 rounded-full cursor-pointer
                    hover:bg-[#EFE6DA] dark:hover:bg-[#201426]
                    text-[#2B2523] dark:text-[#F7F2EC]
                    transition-all duration-300
                    ${userDropdownOpen ? "bg-[#EFE6DA] dark:bg-[#201426] ring-1 ring-[#8C2F4D]/30 dark:ring-[#E5C583]/40" : ""}
                  `}
                >
                  <User size={20} className="hover:text-[#8C2F4D] dark:hover:text-[#E5C583]" />
                  <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu Container with zero-gap hover bridge */}
                <div
                  className={`
                    absolute right-0 top-full pt-1.5 w-56 z-50 transition-all duration-200 origin-top-right
                    ${
                      userDropdownOpen
                        ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 invisible -translate-y-1 scale-95 pointer-events-none"
                    }
                  `}
                >
                  {/* Invisible hover bridge ensuring mouse cursor never leaves hit area */}
                  <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                  <div className="bg-white dark:bg-[#18101C] rounded-2xl shadow-2xl border border-[#E8DFD3] dark:border-[#2E1F33] p-2">
                    <div className="px-3 py-2.5 border-b border-gray-100 dark:border-[#2E1F33]">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user.email || user.phone}</p>
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-[#6D1830]/10 text-[#6D1830] dark:bg-[#E5C583]/20 dark:text-[#E5C583] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          <ShieldCheck size={11} />
                          Admin Console
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#FAF6F0] dark:hover:bg-[#241729] rounded-xl transition"
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/loyalty"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#FAF6F0] dark:hover:bg-[#241729] rounded-xl transition"
                      >
                        <span>Privilege Points</span>
                        <span className="font-semibold text-[#8C2F4D] dark:text-[#E5C583]">{points || 0} pts</span>
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs text-[#6D1830] dark:text-[#E5C583] font-bold hover:bg-[#6D1830]/10 dark:hover:bg-[#E5C583]/15 rounded-xl transition border border-[#6D1830]/25 dark:border-[#E5C583]/30 my-1 bg-[#6D1830]/5 dark:bg-[#E5C583]/10"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} />
                            Admin Dashboard
                          </span>
                          <ChevronRight size={13} />
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition font-medium mt-1 flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Customer Login"
                className="
                  hidden sm:flex items-center p-2 rounded-full
                  text-[#2B2523] dark:text-[#F7F2EC]
                  hover:text-[#8C2F4D] dark:hover:text-[#E5C583]
                  hover:bg-[#EFE6DA] dark:hover:bg-[#201426]
                  transition-all duration-300
                "
              >
                <User size={20} />
              </Link>
            )}

            {/* Creative Dark/Light Mode Switcher */}
            <div className="ml-1 flex items-center">
              <div className="hidden sm:flex items-center">
                <ThemeToggle />
              </div>
              <div className="flex sm:hidden items-center">
                <ThemeToggle compact />
              </div>
            </div>

          </div>

        </div>
      </nav>

      {/* Backdrop Overlay for Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sliding Mobile Navigation Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[85vw] max-w-[340px]
          bg-[#FAF6F0] dark:bg-[#120B15]
          border-r border-[#E8DFD3] dark:border-[#2C1F32]
          shadow-2xl z-50
          flex flex-col
          transform transition-transform duration-400 ease-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8DFD3] dark:border-[#2C1F32] flex items-center justify-between">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
            <BrandLogo size="small" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            className="p-2 rounded-full text-gray-500 hover:text-[#6D1830] dark:hover:text-[#E8C58D] hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* User / Member VIP Pass Card inside Drawer */}
        <div className="p-4 border-b border-[#E8DFD3] dark:border-[#2C1F32]">
          {user ? (
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#1E0E1B] via-[#2D1225] to-[#140811] border border-[#D4B483]/40 text-[#FAF7F2] shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4B483]/15 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4B483]/20 border border-[#D4B483]/40 text-[10px] uppercase font-semibold text-[#E8C58D] flex items-center gap-1 w-fit">
                    <Crown size={11} className="text-[#D4B483]" /> Glam Clan Member
                  </span>
                  <h4 className="text-base font-serif font-bold text-[#FAF7F2] mt-1.5">{user.name}</h4>
                  <p className="text-xs text-[#E8C58D] font-mono mt-0.5">{points || 0} Privilege Points</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E8C58D] transition border border-[#D4B483]/30 text-center"
                  >
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="px-2.5 py-1 rounded-xl bg-[#E5C583] hover:bg-[#D4B483] text-[11px] font-bold text-[#1F0712] transition shadow-xs text-center flex items-center justify-center gap-1"
                    >
                      <ShieldCheck size={12} />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#6D1830] via-[#8C2F4D] to-[#541223] text-white shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#D4B483]/20 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[2px] text-[#E8C58D] font-semibold flex items-center gap-1">
                  <Crown size={12} className="text-[#E8C58D]" /> Ethnique Privilege Club
                </span>
                <p className="text-sm font-serif font-semibold text-white mt-1">
                  Discover Designer Ethnic Sarees
                </p>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-[#E8C58D]/40 text-xs font-semibold text-[#E8C58D] transition"
                >
                  <span>Sign In / Join Clan</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[2.5px] text-gray-400 font-semibold mb-2.5 px-2">
              Curated Collections
            </p>
            <div className="space-y-1">
              <DrawerLink to="/" label="Home" icon={Home} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/products" label="Explore All Sarees" icon={ShoppingBag} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/products?cat=cotton" label="Pure Cotton Sarees" icon={Sparkles} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/products?cat=silk" label="Designer Silk Sarees" icon={Crown} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/reels" label="Video Reels & Looks" icon={Compass} badge="Lookbook" onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/loyalty" label="Privilege & Coupons" icon={Gift} badge="Offers" onClick={() => setMenuOpen(false)} />
            </div>
          </div>

          <hr className="border-[#E8DFD3] dark:border-[#2C1F32]" />

          <div>
            <p className="text-[10px] uppercase tracking-[2.5px] text-gray-400 font-semibold mb-2.5 px-2">
              Customer Care & Concierge
            </p>
            <div className="space-y-1">
              <DrawerLink to="/about" label="Our Heritage Story" icon={BookOpen} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/contact" label="Bespoke Inquiries & Support" icon={MessageCircle} onClick={() => setMenuOpen(false)} />
              <DrawerLink to="/shipping" label="Insured Shipping Policy" icon={Truck} badge="Express" onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>

        {/* Drawer Footer with Theme Toggle and Logout */}
        <div className="p-4 border-t border-[#E8DFD3] dark:border-[#2C1F32] bg-[#FAF6F0] dark:bg-[#120B15] space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#EFE6DA]/60 dark:bg-[#1A1121] border border-[#D4B483]/30">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon size={15} className="text-[#E8C58D]" />
              ) : (
                <Sun size={15} className="text-[#B8860B]" />
              )}
              <span className="text-xs text-[var(--text-primary)] font-medium">
                {isDark ? "Velvet Noir Mode" : "Daylight Royal Mode"}
              </span>
            </div>
            <ThemeToggle compact />
          </div>

          {user && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#8C2F4D] dark:text-[#E8C58D] hover:bg-[#8C2F4D]/10 rounded-xl transition flex items-center justify-center gap-1.5 border border-[#8C2F4D]/30"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ label, to, active }) => (
  <Link
    to={to}
    className={`
      relative py-1
      font-medium text-sm tracking-wide
      transition-colors duration-300
      ${
        active
          ? "text-[#6D1830] dark:text-[#E5C583] font-semibold"
          : "text-[#2B2523] dark:text-[#EADFD5] hover:text-[#6D1830] dark:hover:text-[#E5C583]"
      }
      after:absolute
      after:left-0
      after:-bottom-1
      after:h-[2px]
      after:bg-gradient-to-r after:from-[#D4B483] after:to-[#B8860B]
      after:transition-all
      after:duration-300
      ${active ? "after:w-full" : "after:w-0 hover:after:w-full"}
    `}
  >
    {label}
  </Link>
);

const DrawerLink = ({ to, label, icon: Icon, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="
      group flex items-center justify-between px-3.5 py-2.5 rounded-2xl
      text-[#2B2523] dark:text-[#ECE5DC]
      hover:text-[#6D1830] dark:hover:text-[#E5C583]
      hover:bg-[#EFE6DA]/70 dark:hover:bg-[#231529]/80
      transition-all duration-200
    "
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="p-1.5 rounded-xl bg-[#D4B483]/15 text-[#8C2F4D] dark:text-[#E8C58D] group-hover:scale-110 transition-transform">
          <Icon size={16} />
        </span>
      )}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-xs">
          {badge}
        </span>
      )}
      <ChevronRight size={15} className="text-gray-400 group-hover:text-[#8C2F4D] dark:group-hover:text-[#E8C58D] group-hover:translate-x-0.5 transition-all" />
    </div>
  </Link>
);

export default Navbar;