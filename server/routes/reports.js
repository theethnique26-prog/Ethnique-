const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const adminAuth = require("../middleware/Adminauth");

// =====================================
// GET ADMIN REPORTS
// =====================================
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    // =====================================
    // BASIC ORDER STATS
    // =====================================

    const totalOrders = orders.length;

    const pending = orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length;

    const confirmed = orders.filter(
      (order) => order.orderStatus === "Confirmed"
    ).length;

    const packed = orders.filter(
      (order) => order.orderStatus === "Packed"
    ).length;

    const shipped = orders.filter(
      (order) => order.orderStatus === "Shipped"
    ).length;

    const delivered = orders.filter(
      (order) => order.orderStatus === "Delivered"
    ).length;

    const cancelled = orders.filter(
      (order) => order.orderStatus === "Cancelled"
    ).length;

    // =====================================
    // REVENUE
    // =====================================
    // Cancelled orders are excluded

    const validOrders = orders.filter(
      (order) => order.orderStatus !== "Cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const averageOrderValue =
      validOrders.length > 0
        ? totalRevenue / validOrders.length
        : 0;

    // =====================================
    // PAYMENT STATUS
    // =====================================

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "Paid"
    ).length;

    const pendingPayments = orders.filter(
      (order) => order.paymentStatus === "Pending"
    ).length;

    const failedPayments = orders.filter(
      (order) => order.paymentStatus === "Failed"
    ).length;

    const refundedPayments = orders.filter(
      (order) => order.paymentStatus === "Refunded"
    ).length;

    // =====================================
    // SALES BY MONTH
    // =====================================

    const monthlySales = {};

    validOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      const year = date.getFullYear();
      const month = date.getMonth();

      const key = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}`;

      if (!monthlySales[key]) {
        monthlySales[key] = {
          revenue: 0,
          orders: 0,
        };
      }

      monthlySales[key].revenue +=
        order.totalAmount || 0;

      monthlySales[key].orders += 1;
    });

    const salesByMonth = Object.entries(monthlySales)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }));

    // =====================================
    // TOP SELLING PRODUCTS
    // =====================================

    const productStats = {};

    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product
          ? item.product._id.toString()
          : item.name;

        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            name: item.name,
            image: item.image || "",
            quantitySold: 0,
            revenue: 0,
          };
        }

        productStats[productId].quantitySold +=
          item.quantity;

        productStats[productId].revenue +=
          item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    // =====================================
    // RESPONSE
    // =====================================

    res.json({
      success: true,

      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
      },

      orderStatus: {
        pending,
        confirmed,
        packed,
        shipped,
        delivered,
        cancelled,
      },

      paymentStatus: {
        paid: paidOrders,
        pending: pendingPayments,
        failed: failedPayments,
        refunded: refundedPayments,
      },

      salesByMonth,

      topProducts,
    });
  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;