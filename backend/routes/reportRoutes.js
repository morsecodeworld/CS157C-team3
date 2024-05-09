// routes/reportRoutes.js
const express = require("express");
const Item = require("../models/Item");
const Order = require("../models/Order");
const { requireAuth, requireRole } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/reports/inventoryValuation:
 *   get:
 *     summary: Get inventory valuation report
 *     tags: [Report]
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: Inventory valuation calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalValue:
 *                   type: number
 *                   description: Total value of inventory
 *       500:
 *         description: Error message
 */
router.get(
  "/inventoryValuation",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const organizationId = req.user.organizationId;
      const items = await Item.find({ organization: organizationId });
      const totalValue = items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
      res.status(200).json({ totalValue });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * @swagger
 * /api/reports/salesReport:
 *   get:
 *     summary: Get sales report within a date range
 *     tags: [Report]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the sales report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the sales report
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: string
 *                     description: ID of the order
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date of the order
 *                   total:
 *                     type: number
 *                     description: Total sales amount for the order
 *       500:
 *         description: Error message
 */
router.get(
  "/salesReport",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { startDate, endDate } = req.query;
    const organizationId = req.user.organizationId;

    try {
      const orders = await Order.find({
        organization: organizationId,
        status: "completed",
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      }).populate("items.item");

      const salesData = orders.map((order) => ({
        orderId: order._id,
        date: order.createdAt,
        total: order.items.reduce(
          (acc, { item, quantity }) => acc + item.price * quantity,
          0
        ),
      }));

      res.status(200).json(salesData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * @swagger
 * /api/reports/orderHistory:
 *   get:
 *     summary: Get order history within a date range
 *     tags: [Report]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for the order history
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for the order history
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error message
 */
router.get(
  "/orderHistory",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { startDate, endDate } = req.query;
    const organizationId = req.user.organizationId;

    try {
      const query = { organization: organizationId };
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      const orders = await Order.find(query).populate("items.item");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * @swagger
 * /api/reports/summaryReport:
 *   get:
 *     summary: Retrieves a summary report of order metrics and earnings.
 *     tags:
 *       - Report
 *     security:
 *       - Authorization: []
 *     description: Fetches a comprehensive summary report including the total number of completed, pending, and unpaid orders, along with the total earnings from all completed orders.
 *     responses:
 *       200:
 *         description: A summary of order metrics and earnings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCompletedOrders:
 *                   type: integer
 *                   description: The total number of completed orders.
 *                 totalPendingOrders:
 *                   type: integer
 *                   description: The total number of pending orders.
 *                 totalUnpaidOrders:
 *                   type: integer
 *                   description: The total number of unpaid orders.
 *                 totalEarnings:
 *                   type: number
 *                   format: float
 *                   description: The total earnings from all completed orders.
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing what went wrong.
 */
router.get(
  "/summaryReport",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { organizationId } = req.user;

      // Construct the start of today in the organization's local time zone
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      // Fetch the total number of completed orders for the organization
      const totalCompletedOrders = await Order.countDocuments({
        status: "completed",
        organization: organizationId,
      });

      // Fetch the total number of pending orders for the organization
      const totalPendingOrders = await Order.countDocuments({
        status: "pending",
        organization: organizationId,
      });

      // Fetch the total number of unpaid orders for the organization
      const totalUnpaidOrders = await Order.countDocuments({
        paymentStatus: "pending",
        organization: organizationId,
      });

      // Aggregate to calculate total earnings from all completed orders for the organization
      const earningsAggregation = await Order.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
            organization: organizationId,
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: {
                $multiply: ["$items.quantity", "$items.priceAtPurchase"],
              },
            },
          },
        },
      ]);

      // Aggregate to calculate today's earnings
      const todaysEarningsAggregation = await Order.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
            organization: organizationId,
            orderDate: { $gte: startOfToday },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            todaysEarnings: {
              $sum: {
                $multiply: ["$items.quantity", "$items.priceAtPurchase"],
              },
            },
          },
        },
      ]);

      const totalEarnings =
        earningsAggregation.length > 0
          ? earningsAggregation[0].totalEarnings
          : 0;

      const todaysEarnings =
        todaysEarningsAggregation.length > 0
          ? todaysEarningsAggregation[0].todaysEarnings
          : 0;

      // Calculate the start date for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Aggregate to calculate the earnings for the last 30 days
      const last30DaysEarningsAggregation = await Order.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
            organization: organizationId,
            orderDate: { $gte: thirtyDaysAgo },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            last30DaysEarnings: {
              $sum: {
                $multiply: ["$items.quantity", "$items.priceAtPurchase"],
              },
            },
          },
        },
      ]);

      const last30DaysEarnings =
        last30DaysEarningsAggregation.length > 0
          ? last30DaysEarningsAggregation[0].last30DaysEarnings
          : 0;

      // Calculate the start date for the last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Aggregate to calculate the earnings for the last 90 days
      const last90DaysEarningsAggregation = await Order.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
            organization: organizationId,
            orderDate: { $gte: ninetyDaysAgo },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            last90DaysEarnings: {
              $sum: {
                $multiply: ["$items.quantity", "$items.priceAtPurchase"],
              },
            },
          },
        },
      ]);

      const last90DaysEarnings =
        last90DaysEarningsAggregation.length > 0
          ? last90DaysEarningsAggregation[0].last90DaysEarnings
          : 0;

      const summary = {
        totalCompletedOrders,
        totalPendingOrders,
        totalUnpaidOrders,
        totalEarnings,
        todaysEarnings,
        last30DaysEarnings,
        last90DaysEarnings,
      };

      res.status(200).json(summary);
    } catch (error) {
      console.error("Error generating summary report:", error);
      res.status(500).send(error.message);
    }
  }
);

/**
 * @swagger
 * /api/reports/earningsReportLast7Days:
 *   get:
 *     summary: Retrieves total earnings report for the last 7 days.
 *     tags: [Report]
 *     security:
 *       - Authorization: []
 *     description: Fetches total earnings for orders that are both completed and paid within the last 7 days. Only accessible by users with the admin role.
 *     responses:
 *       200:
 *         description: A summary of earnings within the last 7 days.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 last7DaysEarnings:
 *                   type: number
 *                   description: Total earnings in the last 7 days.
 *                   format: float
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing what went wrong.
 */
router.get(
  "/earningsReportLast7Days",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
      const aggregationPipeline = [
        {
          $match: {
            organization: organizationId,
            status: "completed",
            paymentStatus: "paid",
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: {
                $multiply: ["$items.quantity", "$itemDetails.priceAtPurchase"],
              },
            },
          },
        },
      ];

      const result = await Order.aggregate(aggregationPipeline);

      res.status(200).json({
        last7DaysEarnings: result.length > 0 ? result[0].totalEarnings : 0,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching earnings report for the last 7 days",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/reports/earningsReportLast3Months:
 *   get:
 *     summary: Retrieves total earnings report for the last 3 months.
 *     tags: [Report]
 *     security:
 *       - Authorization: []
 *     description: Fetches total earnings for orders that are both completed and paid within the last 3 months. Only accessible by users with the admin role.
 *     responses:
 *       200:
 *         description: A summary of earnings within the last 3 months.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 last3MonthsEarnings:
 *                   type: number
 *                   description: Total earnings in the last 3 months.
 *                   format: float
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing what went wrong.
 */
router.get(
  "/earningsReportLast3Months",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
      const aggregationPipeline = [
        {
          $match: {
            organization: organizationId,
            status: "completed",
            paymentStatus: "paid",
            createdAt: {
              // Adjust to the last 3 months
              $gte: new Date(new Date().setDate(new Date().getDate() - 90)),
            },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: {
                // Ensure to multiply quantity by priceAtPurchase for total
                $multiply: ["$items.quantity", "$items.priceAtPurchase"],
              },
            },
          },
        },
      ];

      const result = await Order.aggregate(aggregationPipeline);

      res.status(200).json({
        last3MonthsEarnings: result.length > 0 ? result[0].totalEarnings : 0,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching earnings report for the last 3 months",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         total:
 *           type: number
 */

module.exports = router;
