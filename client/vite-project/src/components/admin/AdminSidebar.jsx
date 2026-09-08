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
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

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
    // {
    //   name: "Reviews",
    //   icon: Star,
    //   path: "/admin/reviews",
    // },
    // {
    //   name: "Reports",
    //   icon: BarChart3,
    //   path: "/admin/reports",
    // },
    // {
    //   name: "Settings",
    //   icon: Settings,
    //   path: "/admin/settings",
    // },
  ];

  return (
    <div className="w-[280px] min-h-screen bg-gradient-to-b from-[#4d0f1e] to-[#22030d] text-white flex flex-col">

      <div className="p-8 border-b border-white/10">
        <h1 className="text-4xl font-serif">
          ETHNIQUE
        </h1>

        <p className="tracking-[4px] text-xs mt-2 text-white/70">
          ADMIN PANEL
        </p>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <Icon size={18} />

              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;