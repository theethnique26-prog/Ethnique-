import { useEffect, useState } from "react";
import orderApi from "../../services/orderApi";
import { API_BASE } from "../../services/apiConfig";
import { Truck, Printer, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
const [loadingOrder, setLoadingOrder] = useState(false); 
const [shippingLoading, setShippingLoading] = useState(false);

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const handleShipDelhivery = async (orderId) => {
  if (!window.confirm("Generate Delhivery AWB and manifest this order for courier pickup?")) return;
  setShippingLoading(true);
  try {
    const res = await orderApi.shipWithDelhivery(orderId);
    if (res.success) {
      alert(`Success! Delhivery Waybill AWB generated: ${res.waybill}`);
      loadOrders();
      const data = await orderApi.getOrder(orderId);
      setSelectedOrder(data.order);
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to manifest order with Delhivery");
  } finally {
    setShippingLoading(false);
  }
};

const handleView = async (id) => {
  try {
    setLoadingOrder(true);

    const data = await orderApi.getOrder(id);

    setSelectedOrder(data.order);

  } catch (err) {
    console.log(err);
  }

  setLoadingOrder(false);
};

  useEffect(() => {
    loadOrders();
  }, []);
const handleStatusChange = async (orderId, status) => {
  try {
    await orderApi.updateStatus(orderId, status);

    // Refresh orders list
    loadOrders();

    // Refresh modal
    const data = await orderApi.getOrder(orderId);
    setSelectedOrder(data.order);

  } catch (err) {
    console.log(err);
    alert("Failed to update order status");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this order?")) return;

  try {
    await orderApi.deleteOrder(id);

    loadOrders();

    if (selectedOrder?._id === id) {
      setSelectedOrder(null);
    }

  } catch (err) {
    console.log(err);
    alert("Failed to delete order");
  }
};
  const loadOrders = async () => {

    try {

      const data = await orderApi.getOrders();

      setOrders(data.orders);

      setStats(data.stats);

    } catch (err) {

      console.log(err);

    }

  };

  const filteredOrders = orders.filter((order) => {

    return (
      order.customer?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      order.customer?.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  });

  return (
  <>
    <div className="space-y-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">

        <div>
          <h1 className="text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
            Orders
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage all customer orders &amp; shipments
          </p>
        </div>

        <input
          placeholder="Search orders, customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#120B15] text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 w-72 text-sm focus:outline-none focus:border-[#6D1830]"
        />

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <Card title="Total Orders" value={stats.totalOrders || 0} />
        <Card title="Pending" value={stats.pending || 0} />
        <Card title="Delivered" value={stats.delivered || 0} />
        <Card title="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`} />

      </div>

      <div className="bg-white dark:bg-[#18101C] rounded-3xl shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] overflow-hidden transition-colors">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order._id}
                className="border-t"
              >

                <td className="p-4">

                  <div className="font-medium">
                    {order.customer?.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.customer?.email}
                  </div>

                </td>

                <td className="p-4">
                  <div className="font-medium">{order.orderStatus}</div>
                  {order.waybill && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                      <Truck size={10} /> {order.waybill}
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {order.paymentStatus}
                </td>

                <td className="p-4">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() => handleView(order._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(order._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {selectedOrder && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[850px] max-h-[90vh] overflow-y-auto p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl"
              >
                ×
              </button>

            </div>

            <div className="grid md:grid-cols-2 gap-8">

              <div>

                <h3 className="font-semibold mb-3">
                  Customer
                </h3>

                <p><strong>Name:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>

              </div>

              <div>

                <h3 className="font-semibold mb-3">
                  Shipping Address
                </h3>

                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.phone}</p>
                <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                <p>{selectedOrder.shippingAddress?.addressLine2}</p>
                <p>{selectedOrder.shippingAddress?.city}</p>
                <p>{selectedOrder.shippingAddress?.state}</p>
                <p>{selectedOrder.shippingAddress?.pincode}</p>

              </div>

            </div>

            <hr className="my-6" />

            <h3 className="font-semibold mb-5">
              Products
            </h3>

            <div className="space-y-4">

              {selectedOrder.items.map((item) => (

                <div
                  key={item.product?._id || item.name}
                  className="flex items-center gap-4 border rounded-xl p-4"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <h4 className="font-semibold text-lg">
                      {item.name}
                    </h4>

                    <p>Quantity : {item.quantity}</p>

                    <p className="text-[#6D1830] font-semibold">
                      ₹{item.price}
                    </p>

                  </div>

                  <div className="font-bold text-lg">
                    ₹{item.price * item.quantity}
                  </div>

                </div>

              ))}

            </div>

            <div className="mt-6">

              <label className="block font-semibold mb-2">
                Order Status
              </label>

              <select
                value={selectedOrder.orderStatus}
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder._id,
                    e.target.value
                  )
                }
                className="border rounded-lg px-3 py-2"
              >

                {ORDER_STATUSES.map((status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>

                ))}

              </select>

            </div>

            {/* Delhivery Express Logistics & Shipping Panel */}
            <div className="mt-6 p-5 rounded-2xl bg-[#8B1E3F]/5 border border-[#8B1E3F]/20 dark:border-[#E5C583]/20">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#8B1E3F] text-white flex items-center justify-center">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      Delhivery Surface Express Courier
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Destination: {selectedOrder.shippingAddress?.city || "Chiplun"}, PIN {selectedOrder.shippingAddress?.pincode}
                    </p>
                  </div>
                </div>

                {selectedOrder.waybill ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck size={14} />
                    <span>AWB: {selectedOrder.waybill}</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Ready for Courier Booking
                  </span>
                )}
              </div>

              {selectedOrder.waybill ? (
                <div className="space-y-3 pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Courier Status: <strong className="text-gray-900 dark:text-white">{selectedOrder.courierStatus || "Manifested"}</strong>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Carrier: <strong>Delhivery Surface B2C</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`${API_BASE}/delhivery/label/${selectedOrder.waybill}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition shadow-sm"
                    >
                      <Printer size={14} />
                      <span>Print Shipping Label (4x6)</span>
                    </a>

                    <a
                      href={`https://www.delhivery.com/track/package/${selectedOrder.waybill}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold transition"
                    >
                      <ExternalLink size={13} />
                      <span>Track on Delhivery</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={shippingLoading}
                    onClick={() => handleShipDelhivery(selectedOrder._id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {shippingLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Generating Delhivery AWB...</span>
                      </>
                    ) : (
                      <>
                        <Truck size={14} />
                        <span>Ship via Delhivery Express (Generate AWB & Label)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Generates official barcode shipping label, schedules pickup at Chiplun warehouse, and changes order status to Shipped.
                  </p>
                </div>
              )}
            </div>

            {selectedOrder.shippingAddress?.phone && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-gray-500">Concierge Helpline: +91 73870 20612</span>
                <a
                  href={`https://wa.me/91${selectedOrder.shippingAddress.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                    `Hello ${selectedOrder.shippingAddress.fullName || "Customer"}! ✨ Greetings from Ethnique Concierge (+91 73870 20612).\n\nYour order #${selectedOrder._id.slice(-6).toUpperCase()} status is currently: *${selectedOrder.orderStatus}*.\nTotal: ₹${selectedOrder.totalAmount}\n\nThank you for choosing Ethnique!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  <span>Notify Client via WhatsApp</span>
                </a>
              </div>
            )}

          </div>

        </div>

      )}

    </div>
  </>
);

}

function Card({ title, value }) {
  return (
    <div className="bg-white dark:bg-[#18101C] rounded-2xl shadow-sm border border-[#E8E2DC]/60 dark:border-[#2C1F32] p-5 transition-colors">
      <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold font-serif text-gray-900 dark:text-[#FAF5EF] mt-2">{value}</div>
    </div>
  );
}

export default Orders;