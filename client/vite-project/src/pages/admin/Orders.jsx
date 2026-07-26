import { useEffect, useState } from "react";
import orderApi from "../../services/orderApi";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
const [loadingOrder, setLoadingOrder] = useState(false); 

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

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
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="text-gray-500">
            Manage all customer orders
          </p>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">

        <Card title="Orders" value={stats.totalOrders} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Delivered" value={stats.delivered} />
        <Card title="Revenue" value={`₹${stats.revenue || 0}`} />

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

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
                  {order.orderStatus}
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

          </div>

        </div>

      )}

    </div>
  </>
);

}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

export default Orders;