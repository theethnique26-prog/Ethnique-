import { useEffect, useState } from "react";
import orderApi from "../../services/orderApi";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

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
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">

        <Card
          title="Orders"
          value={stats.totalOrders}
        />

        <Card
          title="Pending"
          value={stats.pending}
        />

        <Card
          title="Delivered"
          value={stats.delivered}
        />

        <Card
          title="Revenue"
          value={`₹${stats.revenue || 0}`}
        />

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Payment
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order)=>(

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
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    View
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

function Card({title,value}){

  return(

    <div className="bg-white rounded-xl shadow p-5">

      <div className="text-gray-500">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>

    </div>

  );

}

export default Orders;