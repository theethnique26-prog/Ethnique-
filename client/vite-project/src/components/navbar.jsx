import React, { useState } from "react";
import logo from "../assets/finallogo.jpeg";
import { useLoyalty } from "../context/LoyaltyContext";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingCart,
  User,
  Gift,
  PlayCircle,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import CurrencyToggle from "../components/currencytoggle";
import { useContext } from "react";
import {
  CartContext,
} from "../context/CartContext";
import {
  WishlistContext,
} from "../context/Wishlistcontext";
import {
  CountryContext,
} from "../context/CoutryContext";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
  country,
  changeCountry,
} = useContext(CountryContext);
  const navigate = useNavigate();
  const { points } = useLoyalty();
  const { user, logout } = useAuth();

  const { cart } =
    useContext(CartContext);

  const { wishlist } =
    useContext(WishlistContext);

  return (
    <>
      <nav
  className="
    w-full
    bg-white
    border-b
    border-[#E8E2DC]
    sticky
    top-0
    z-50
    shadow-sm
  "
>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
        <div className="flex items-center min-w-[320px]">
  <button
    onClick={() => setMenuOpen(true)}
    className="
      p-2
      rounded-full
      hover:bg-[#F3EEE7]
      transition
    "
  >
    <Menu size={24} />
  </button>

  <Link to="/" className="ml-10">
    <img
      src={logo}
      alt="logo"
      className="h-16 object-contain"
    />
  </Link>
</div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">

            <NavItem to="/" label="Home" />
            <NavItem to="/products" label="Shop" />
            <NavItem to="/reels" label="Reels" />

            <div className="relative">
 <Heart
  size={22}
  onClick={() => navigate("/wishlist")}
  className="
    cursor-pointer
    transition-all
    duration-300
    hover:text-[#8C2F4D]
    hover:scale-110
  "
/>
{/* wishlist */}
  {wishlist.length > 0 && (
    <span
      className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      rounded-full
      w-5
      h-5
      flex
      items-center
      justify-center
    "
    >
      {wishlist.length}
    </span>
  )}
</div>
{/* cart */}
<div className="relative">
  <ShoppingCart
    size={22}
    className="
      cursor-pointer
      transition-all
      duration-300
      hover:text-[#8C2F4D]
      hover:scale-110
    "
    onClick={() => navigate("/cart")}
  />

  {cart.length > 0 && (
    <span
      className="
      absolute
      -top-2
      -right-2
      bg-black
      text-white
      text-xs
      rounded-full
      w-5
      h-5
      flex
      items-center
      justify-center
      "
    >
      {cart.length}
    </span>
  )}
</div>

{user ? (
  <div className="relative group">
    <Link to="/profile" className="flex items-center gap-1.5 py-1">
      <User
        size={22}
        className="
          cursor-pointer
          transition-all
          duration-300
          hover:text-[#8C2F4D]
          hover:scale-110
        "
      />
      <span className="hidden xl:inline text-xs font-medium text-gray-700 max-w-[80px] truncate">
        {user.name?.split(" ")[0]}
      </span>
    </Link>
    {/* Dropdown on hover */}
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 hidden group-hover:block z-50">
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
        {user.role === "admin" && (
          <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        )}
      </div>
      <Link
        to="/profile"
        className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl transition"
      >
        My Profile
      </Link>
      {user.role === "admin" && (
        <Link
          to="/admin/dashboard"
          className="block px-3 py-2 text-xs text-[#6D1830] font-medium hover:bg-[#6D1830]/5 rounded-xl transition"
        >
          Admin Dashboard
        </Link>
      )}
      <button
        onClick={logout}
        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
      >
        Logout
      </button>
    </div>
  </div>
) : (
  <Link to="/login">
    <User
      size={22}
      className="
        cursor-pointer
        transition-all
        duration-300
        hover:text-[#8C2F4D]
        hover:scale-110
      "
    />
  </Link>
)}

            {/* <CurrencyToggle /> */}
 <div
  className="
    relative
    flex
    items-center
    bg-[#F5F2EE]
    rounded-full
    p-1
    border
    border-[#E5DDD5]
    shadow-sm
    w-[170px]
    h-[48px]
  "
>
  {/* Active Background */}
 <div
  className={`
    absolute
    top-1
    bottom-1
    w-[80px]
    rounded-full
    bg-white
    shadow-[0_4px_20px_rgba(109,24,48,0.15)]
    transition-all
    duration-300
    ${
      country === "USA"
        ? "translate-x-[82px]"
        : "translate-x-0"
    }
  `}
/>

  <button
    onClick={() =>
      changeCountry("IND")
    }
    className={`
      relative
      z-10
      flex-1
      text-sm
      font-medium
      transition
      ${
        country === "IND"
          ? "text-[#6D1830]"
          : "text-gray-500"
      }
    `}
  >
    ₹ INR
  </button>

  <button
    onClick={() =>
      changeCountry("USA")
    }
    className={`
      relative
      z-10
      flex-1
      text-sm
      font-medium
      transition
      ${
        country === "USA"
          ? "text-[#6D1830]"
          : "text-gray-500"
      }
    `}
  >
    $ USD
  </button>
</div>
</div>    
 </div>
      </nav>
      {/* Overlay */}
{menuOpen && (
  <div
    className="
      fixed
      inset-0
      bg-black/40
      z-40
    "
    onClick={() => setMenuOpen(false)}
  />
)}
<div
  className={`
    fixed
    top-0
    left-0
    h-screen
    w-80
    bg-[#FAF7F2]
    shadow-2xl
    z-50
    flex
    flex-col
    transform
    transition-all
    duration-300
    ${
      menuOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }
  `}
>

  {/* Header */}

 <div className="border-b border-[#E8E2DC] p-6">

  {/* Top Row */}
  <div className="flex items-center justify-between">

    <h2 className="font-serif text-2xl text-[#6D1830]">
      Menu
    </h2>

  </div>

  {/* User Section */}
  {user && (
    <div className="mt-8">

      <p className="text-xs uppercase tracking-[2px] text-gray-400">
  Welcome Back
</p>

<p className="text-xl font-semibold text-[#6D1830] mt-2">
  {user?.name?.split(" ")[0]}
</p>

      

    </div>
  )}

</div>

<div className="flex-1 overflow-y-auto">

  {/* Main Links */}
  <div className="p-6 space-y-7">

    <Link
      to="/"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Home
    </Link>

    <Link
      to="/products"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Shop
    </Link>

    <Link
      to="/new-arrivals"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      New Arrivals
    </Link>

    <Link
      to="/cotton-sarees"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Cotton Sarees
    </Link>

    <Link
      to="/silk-sarees"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Silk Sarees
    </Link>

    <Link
      to="/festive"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Festive Collection
    </Link>

  </div>

  <hr className="mx-6 border-[#E8E2DC]" />

  {/* Secondary Links */}
  <div className="p-6 space-y-5">

    <Link
      to="/loyalty"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Loyalty Program
    </Link>

    <Link
      to="/about"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      About Us
    </Link>

    <Link
      to="/contact"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Contact Us
    </Link>

    <Link
      to="/shipping"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Shipping Policy
    </Link>

    <Link
      to="/returns"
      className="block hover:text-[#6D1830]"
      onClick={() => setMenuOpen(false)}
    >
      Return Policy
    </Link>
  

  </div>

<div className="p-6 border-t border-[#E8E2DC]">

  <button
    onClick={logout}
    className="
  w-full
  py-3
  rounded-xl
  bg-[#8C2F4D]
  text-white
  font-medium
  hover:bg-[#74263F]
  transition-all
  duration-300
  shadow-sm
"
  >
    Logout
  </button>

</div>
</div>
</div>
    </>
  );
};


const NavItem = ({ label, icon, to }) => (
  <Link
    to={to}
    className="
      relative
      flex
      items-center
      gap-1
      text-[#2B2B2B]
      font-medium
      transition
      hover:text-[#6D1830]
      after:absolute
      after:left-0
      after:-bottom-1
      after:w-0
      after:h-[2px]
      after:bg-[#D4B483]
      after:transition-all
      after:duration-300
      hover:after:w-full
    "
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;