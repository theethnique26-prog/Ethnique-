import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await adminApi.get("/dashboard");
      if (res && res.success) {
        setData(res);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  if (!data || !data.stats) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh] text-gray-500 font-serif">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#6D1830] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading live store metrics...</span>
        </div>
      </div>
    );
  }

  const { stats, recentOrders = [], topProducts = [], activeCoupons = [], salesTimeline = [] } = data;

  const defaultSalesData = salesTimeline.length > 0 ? salesTimeline : [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 18000 },
    { day: "Wed", sales: 14000 },
    { day: "Thu", sales: 24000 },
    { day: "Fri", sales: 21000 },
    { day: "Sat", sales: 32000 },
    { day: "Sun", sales: 29000 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
            Welcome back, Admin 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1.5">
            Real-time business insights from Jayant Saree Center &bull; Ethnique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`}
          icon={<IndianRupee size={24} />}
          sub="All confirmed transactions"
        />

        <StatCard
          title="Orders"
          value={stats.totalOrders || 0}
          icon={<ShoppingBag size={24} />}
          sub="Customer orders placed"
        />

        <StatCard
          title="Customers"
          value={stats.totalUsers || 0}
          icon={<Users size={24} />}
          sub="Registered clan members"
        />

        <StatCard
          title="Active Products"
          value={stats.totalProducts || 0}
          icon={<Package size={24} />}
          sub="In-catalog heritage weaves"
        />
      </div>

      {/* Chart & Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C1F32] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-[#FAF5EF]">
                Revenue Trajectory
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rolling 7-day sales breakdown</p>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 bg-[#F8F4EF] dark:bg-[#251525] text-[#6D1830] dark:text-[#E5C583] rounded-lg">
              INR (₹)
            </span>
          </div>

          <div className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultSalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D1830" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6D1830" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales"]}
                  contentStyle={{ backgroundColor: "#22030D", borderRadius: "12px", border: "none", color: "#fff" }}
                  labelStyle={{ color: "#E5C583", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6D1830"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Recent Orders */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C1F32] flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-[#FAF5EF]">
                Recent Orders
              </h2>
              <a href="/admin/orders" className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline font-medium">
                View all &rarr;
              </a>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No recent orders found</p>
              ) : (
                recentOrders.map((ord, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#140C18] border border-gray-100 dark:border-[#2C1F32]">
                    <div>
                      <p className="text-xs font-mono font-semibold text-gray-800 dark:text-gray-200">{ord.id}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{ord.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[#6D1830] dark:text-[#E5C583]">{ord.amount}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        ord.status === "Delivered" ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" :
                        ord.status === "Shipped" ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300" :
                        ord.status === "Cancelled" ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300" :
                        "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <a
            href="/admin/orders"
            className="mt-4 w-full text-center py-2.5 rounded-xl border border-[#D4B483]/60 dark:border-[#38283E] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#FAF8F5] dark:hover:bg-[#201426] transition"
          >
            Manage All Orders
          </a>
        </div>
      </div>

      {/* Top Products & Active Coupons & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {/* Top Products */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C1F32] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-[#FAF5EF]">
              Top Selling Weaves
            </h2>
            <a href="/admin/products" className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline">
              Inventory
            </a>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4">No product sales yet</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 dark:border-[#2C1F32] last:border-0">
                  <span className="truncate max-w-[180px] font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                  <span className="font-mono text-xs text-[#6D1830] dark:text-[#E5C583] bg-[#FAF8F5] dark:bg-[#201426] px-2.5 py-1 rounded-md">
                    {p.count} sold
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Promotional Coupons */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C1F32] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-[#FAF5EF]">
              Active Coupons
            </h2>
            <a href="/loyalty" className="text-xs text-[#6D1830] dark:text-[#E5C583] hover:underline" target="_blank" rel="noreferrer">
              Preview Page
            </a>
          </div>

          <div className="space-y-3">
            {activeCoupons.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4">No active vouchers</p>
            ) : (
              activeCoupons.map((c) => (
                <div key={c._id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#140C18] border border-dashed border-[#D4B483] dark:border-[#584126]">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#6D1830] dark:text-[#E5C583]">{c.code}</span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[170px]">{c.title}</p>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#6D1830] text-white px-2 py-0.5 rounded-full">
                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : c.discountType === "flat" ? `₹${c.discountValue} OFF` : "FREE SHIP"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C1F32] transition-colors">
          <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-[#FAF5EF] mb-5">
            Admin Shortcuts
          </h2>

          <div className="space-y-3">
            <a
              href="/admin/products"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#140C18] hover:bg-[#F2ECE4] dark:hover:bg-[#201426] text-gray-800 dark:text-gray-200 text-sm font-medium transition"
            >
              <span>Add New Heritage Saree</span>
              <Package size={16} className="text-[#6D1830] dark:text-[#E5C583]" />
            </a>

            <a
              href="/admin/orders"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#140C18] hover:bg-[#F2ECE4] dark:hover:bg-[#201426] text-gray-800 dark:text-gray-200 text-sm font-medium transition"
            >
              <span>Review Order Queue</span>
              <ShoppingBag size={16} className="text-[#6D1830] dark:text-[#E5C583]" />
            </a>

            <a
              href="/admin/reports"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#140C18] hover:bg-[#F2ECE4] dark:hover:bg-[#201426] text-gray-800 dark:text-gray-200 text-sm font-medium transition"
            >
              <span>Sales &amp; Financial Reports</span>
              <IndianRupee size={16} className="text-[#6D1830] dark:text-[#E5C583]" />
            </a>

            <a
              href="/admin/homepage"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#140C18] hover:bg-[#F2ECE4] dark:hover:bg-[#201426] text-gray-800 dark:text-gray-200 text-sm font-medium transition"
            >
              <span>Curate Hero Archways</span>
              <span className="text-xs text-[#6D1830] dark:text-[#E5C583] font-serif font-bold">&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  sub,
}) {
  return (
    <div className="bg-white dark:bg-[#18101C] rounded-3xl p-6 shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] transition-colors">
      <div className="mb-4 text-[#6D1830] dark:text-[#E5C583]">
        {icon}
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-[#FAF5EF] mt-1">
        {value}
      </h2>

      {sub && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-light">
          {sub}
        </p>
      )}
    </div>
  );
}

function OrderRow({
  id,
  amount,
}) {
  return (
    <div className="flex justify-between">
      <span>{id}</span>
      <span>{amount}</span>
    </div>
  );
}

export default Dashboard;