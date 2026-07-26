import { useEffect, useState } from "react";
import customerApi from "../../services/customerApi";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const result = customers.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, customers]);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.get("/customers", true);

      if (data.success) {
        setCustomers(data.customers);
        setFiltered(data.customers);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-lg">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-gray-500">
            {customers.length} Registered Customers
          </p>

        </div>

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Orders</th>

              <th className="text-left p-4">Points</th>

              <th className="text-left p-4">Addresses</th>

              <th className="text-left p-4">Joined</th>

              <th className="text-left p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No customers found.
                </td>

              </tr>

            ) : (

              filtered.map((customer) => (

                <tr
                  key={customer._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {customer.name}
                  </td>

                  <td className="p-4">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.orderCount}
                  </td>

                  <td className="p-4">
                    {customer.loyaltyPoints}
                  </td>

                  <td className="p-4">
                    {customer.addresses?.length || 0}
                  </td>

                  <td className="p-4">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">

                    <button
                      className="px-4 py-2 bg-[#6D1830] text-white rounded-lg hover:bg-[#571225]"
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Customers;