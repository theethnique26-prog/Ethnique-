import { useEffect, useState } from "react";
import { API_BASE } from "../../services/apiConfig";

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE}/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reports"
        );
      }

      setReports(data);
    } catch (error) {
      console.error("Reports error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">
          Loading reports...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!reports) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 bg-[#F8F6F3] min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#2C2C2C]">
          Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of your store performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        <ReportCard
          title="Total Revenue"
          value={formatCurrency(
            reports.summary.totalRevenue
          )}
        />

        <ReportCard
          title="Total Orders"
          value={reports.summary.totalOrders}
        />

        <ReportCard
          title="Average Order Value"
          value={formatCurrency(
            reports.summary.averageOrderValue
          )}
        />

      </div>

      {/* Order Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E2DC] mb-8">

        <h2 className="text-xl font-semibold mb-6">
          Order Status
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <StatusCard
            title="Pending"
            value={reports.orderStatus.pending}
          />

          <StatusCard
            title="Confirmed"
            value={reports.orderStatus.confirmed}
          />

          <StatusCard
            title="Packed"
            value={reports.orderStatus.packed}
          />

          <StatusCard
            title="Shipped"
            value={reports.orderStatus.shipped}
          />

          <StatusCard
            title="Delivered"
            value={reports.orderStatus.delivered}
          />

          <StatusCard
            title="Cancelled"
            value={reports.orderStatus.cancelled}
          />

        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E2DC] mb-8">

        <h2 className="text-xl font-semibold mb-6">
          Payment Status
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatusCard
            title="Paid"
            value={reports.paymentStatus.paid}
          />

          <StatusCard
            title="Pending"
            value={reports.paymentStatus.pending}
          />

          <StatusCard
            title="Failed"
            value={reports.paymentStatus.failed}
          />

          <StatusCard
            title="Refunded"
            value={reports.paymentStatus.refunded}
          />

        </div>
      </div>

      {/* Sales Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E2DC] mb-8">

        <h2 className="text-xl font-semibold mb-6">
          Sales Overview
        </h2>

        {reports.salesByMonth.length === 0 ? (
          <p className="text-gray-500">
            No sales data available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b">
                  <th className="py-3">
                    Month
                  </th>

                  <th className="py-3">
                    Orders
                  </th>

                  <th className="py-3">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.salesByMonth.map(
                  (item) => (
                    <tr
                      key={item.month}
                      className="border-b last:border-0"
                    >
                      <td className="py-3">
                        {item.month}
                      </td>

                      <td className="py-3">
                        {item.orders}
                      </td>

                      <td className="py-3 font-medium">
                        {formatCurrency(
                          item.revenue
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E2DC]">

        <h2 className="text-xl font-semibold mb-6">
          Top Selling Products
        </h2>

        {reports.topProducts.length === 0 ? (
          <p className="text-gray-500">
            No product sales data available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b">
                  <th className="py-3">
                    Product
                  </th>

                  <th className="py-3">
                    Quantity Sold
                  </th>

                  <th className="py-3">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.topProducts.map(
                  (product) => (
                    <tr
                      key={product.productId}
                      className="border-b last:border-0"
                    >
                      <td className="py-3">
                        {product.name}
                      </td>

                      <td className="py-3">
                        {product.quantitySold}
                      </td>

                      <td className="py-3 font-medium">
                        {formatCurrency(
                          product.revenue
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}


/* =========================
   REPORT CARD
========================= */

function ReportCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E2DC]">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-2xl font-semibold mt-2 text-[#2C2C2C]">
        {value}
      </h2>
    </div>
  );
}


/* =========================
   STATUS CARD
========================= */

function StatusCard({ title, value }) {
  return (
    <div className="bg-[#F8F6F3] rounded-lg p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

export default Reports;