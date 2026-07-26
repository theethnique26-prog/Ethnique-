import { useEffect, useMemo, useState } from "react";
import orderApi from "../../services/orderApi";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";
import {
  Search,
  Package,
  Clock3,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, search, statusFilter]);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const filterOrders = () => {
    let temp = [...orders];

    if (statusFilter !== "All") {
      temp = temp.filter(
        (o) => o.orderStatus === statusFilter
      );
    }

    if (search) {
      temp = temp.filter(
        (o) =>
          o.customer?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          o.customer?.email
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          o._id.includes(search)
      );
    }

    setFilteredOrders(temp);
  };

  const updateStatus = async (id, status) => {
    await orderApi.updateStatus(id, status);
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete Order?")) return;

    await orderApi.deleteOrder(id);

    fetchOrders();
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(
        (o) => o.orderStatus === "Pending"
      ).length,
      shipped: orders.filter(
        (o) => o.orderStatus === "Shipped"
      ).length,
      delivered: orders.filter(
        (o) => o.orderStatus === "Delivered"
      ).length,
    };
  }, [orders]);

  const badge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";
    }
  };

  if (loading)
    return (
      <div className="p-10">
        Loading Orders...
      </div>
    );

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Orders
      </h1>

      {/* Summary Cards */}

      <div className="grid lg:grid-cols-4 gap-5 mb-10">

        <div className="bg-white rounded-2xl shadow p-6">
          <Package size={35} />
          <h2 className="text-3xl font-bold mt-4">
            {stats.total}
          </h2>
          <p className="text-gray-500">
            Total Orders
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Clock3 size={35} />
          <h2 className="text-3xl font-bold mt-4">
            {stats.pending}
          </h2>
          <p className="text-gray-500">
            Pending
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Truck size={35} />
          <h2 className="text-3xl font-bold mt-4">
            {stats.shipped}
          </h2>
          <p className="text-gray-500">
            Shipped
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <CheckCircle size={35} />
          <h2 className="text-3xl font-bold mt-4">
            {stats.delivered}
          </h2>
          <p className="text-gray-500">
            Delivered
          </p>
        </div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl shadow p-5 mb-8 flex flex-wrap gap-4 items-center">

        <div className="relative">

          <Search
            className="
              absolute
              left-3
              top-3
              text-gray-400
            "
            size={18}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Orders..."
            className="
              border
              rounded-xl
              pl-10
              pr-4
              py-2
              w-80
            "
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-2
          "
        >

          <option>All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Packed</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>

        </select>

      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#F7F5F2]">

            <tr>

              <th className="p-4 text-left">
                Order
              </th>

              <th className="text-left">
                Customer
              </th>

              <th className="text-left">
                Total
              </th>

              <th className="text-left">
                Payment
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Date
              </th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map(
              (order) => (

                <tr
                  key={order._id}
                  className="
                    border-t
                    hover:bg-gray-50
                  "
                >

                  <td className="p-5 font-semibold">
                    #{order._id.slice(-8)}
                  </td>

                  <td>

                    <div className="font-semibold">
                      {
                        order.customer
                          ?.name
                      }
                    </div>

                    <div className="text-sm text-gray-500">
                      {
                        order.customer
                          ?.email
                      }
                    </div>

                  </td>

                  <td>
                    ₹{order.totalAmount}
                  </td>

                  <td>
                    {
                      order.paymentMethod
                    }
                  </td>

                  <td>

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${badge(
                          order.orderStatus
                        )}
                      `}
                    >
                      {
                        order.orderStatus
                      }
                    </span>

                  </td>

                  <td>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                        className="
                          p-2
                          rounded-lg
                          bg-blue-100
                        "
                      >
                        <Eye
                          size={18}
                        />
                      </button>

                      <button
                        onClick={() =>
                          deleteOrder(
                            order._id
                          )
                        }
                        className="
                          p-2
                          rounded-lg
                          bg-red-100
                        "
                      >
                        <Trash2
                          size={18}
                        />
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}

    </div>
  );
}

export default Orders;