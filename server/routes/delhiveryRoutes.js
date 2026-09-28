const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const adminAuth = require("../middleware/Adminauth");
const delhiveryService = require("../services/delhiveryService");

// =====================================
// 1. PINCODE SERVICEABILITY CHECK
// Public for checkout validation
// =====================================
router.get("/serviceability/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;
    const result = await delhiveryService.checkServiceability(pincode);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Delhivery serviceability check error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// 2. MANIFEST ORDER & CREATE DELHIVERY WAYBILL
// Admin only: Triggered when admin ships order
// =====================================
router.post("/ship/:orderId", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shippingAddress || !order.shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "Order is missing complete shipping address",
      });
    }

    // Call Delhivery shipment manifest
    const manifestResult = await delhiveryService.createShipment(order);

    if (manifestResult.success) {
      order.shippingProvider = "Delhivery";
      order.waybill = manifestResult.waybill;
      order.courierStatus = manifestResult.courierStatus || "Manifested";
      order.shippingLabelUrl = manifestResult.labelUrl || `/api/delhivery/label/${manifestResult.waybill}`;
      order.orderStatus = "Shipped";
      order.delhiveryPickupDate = new Date();
      order.delhiveryHistory = [
        {
          timestamp: new Date(),
          status: "Manifested with Delhivery Surface Express",
          location: "Jayant Saree Center Warehouse, Chiplun",
        },
      ];

      await order.save();

      return res.json({
        success: true,
        message: `Shipment manifested successfully with Delhivery! AWB: ${manifestResult.waybill}`,
        waybill: manifestResult.waybill,
        labelUrl: order.shippingLabelUrl,
        order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: manifestResult.message || "Failed to manifest shipment with Delhivery",
      });
    }
  } catch (error) {
    console.error("Delhivery ship error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// 3. TRACK DELHIVERY SHIPMENT
// Public tracking by AWB Waybill
// =====================================
router.get("/track/:waybill", async (req, res) => {
  try {
    const { waybill } = req.params;
    const tracking = await delhiveryService.trackShipment(waybill);
    res.json({
      success: true,
      tracking,
    });
  } catch (error) {
    console.error("Delhivery tracking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// 4. PRINTABLE SHIPPING LABEL (PACKING SLIP)
// =====================================
router.get("/label/:waybill", async (req, res) => {
  try {
    const { waybill } = req.params;
    const order = await Order.findOne({ waybill }).populate("customer", "name email");

    const html = delhiveryService.generatePrintableLabelHtml({
      waybill,
      order,
    });

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("Delhivery label generation error:", error);
    res.status(500).send("Error generating shipping label");
  }
});

module.exports = router;
