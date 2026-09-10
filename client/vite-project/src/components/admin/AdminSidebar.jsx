import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Home,
  Image,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Film,
  Menu,
  X,
  Calendar,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../BrandLogo";
import ThemeToggle from "../ThemeToggle";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      path: "/admin/orders",
    },
    {
      name: "Customers",
      icon: Users,
      path: "/admin/customers",
    },
    {
      name: "Homepage",
      icon: Home,
      path: "/admin/homepage",
    },
    {
      name: "Reels",
      icon: Film,
      path: "/admin/reels",
    },
    {
      name: "Banners",
      icon: Image,
      path: "/admin/banners",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      name: "Appointments",
      icon: Calendar,
      path: "/admin/appointments",
    },
  ];

  return (
    <>
      {/* Mobile Top Navbar for Admin */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#3D0B18] text-white sticky top-0 z-30 shadow-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <BrandLogo size="small" forceDark={true} />
          <span className="text-[10px] tracking-[2px] text-[#E5C583] font-bold">ADMIN</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="Toggle admin navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[260px] md:w-[260px] lg:w-[280px] min-h-screen
          bg-gradient-to-b from-[#420B1A] via-[#2F0712] to-[#1A030A] text-white
          flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-r border-white/10
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          {/* Brand Header with Actual Ethnique Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/15">
            <div className="flex flex-col items-start gap-1">
              <BrandLogo forceDark={true} />
              <p className="tracking-[3px] text-[10px] font-semibold text-[#E5C583] pl-0.5">
                ADMIN CONSOLE
              </p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-white/20 to-white/10 text-[#E5C583] font-semibold shadow-sm border border-[#E5C583]/30"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#E5C583]" : "text-white/60"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel: Dark Mode Option & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
          {/* Dark Mode Switcher */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold text-[#E5C583]">Dark Mode</span>
            <ThemeToggle compact />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-500/30 transition text-xs font-semibold uppercase tracking-wider"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;