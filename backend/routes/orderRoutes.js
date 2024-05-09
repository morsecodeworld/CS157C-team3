// routes/orderRoutes.js
const express = require("express");
const Order = require("../models/Order");
const Item = require("../models/Item");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Error message
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;

    // Iterate over each order item and update the stock quantity
    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);
      if (!item) {
        throw new Error("Item not found");
      }
      if (item.quantity < orderItem.quantity) {
        throw new Error("Insufficient stock for item: " + item.name);
      }
      item.quantity -= orderItem.quantity;
      await item.save();
    }

    const organizationId = req.user.organizationId;
    const orderData = { ...req.body, organization: organizationId };

    // Create the order
    const order = new Order(orderData);
    await order.save();

    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with optional filtering and pagination
 *     tags: [Order]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of orders per page
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error message
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      startDate,
      endDate,
    } = req.query;

    let filters = { organization: organizationId };

    if (status) {
      filters.status = status;
    }
    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
    }
    if (startDate && endDate) {
      filters.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(filters)
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("items.item");

    const count = await Order.countDocuments(filters);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error message
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const order = await Order.findById({
      _id: req.params.id,
      organization: organizationId,
    }).populate("items.item");
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Order]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Error message
 *       404:
 *         description: Order not found
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { status, items } = req.body;
    const organizationId = req.user.organizationId;
    const order = await Order.findById({
      _id: req.params.id,
      organization: organizationId,
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // If the order is being canceled, update the item quantities
    if (status === "canceled" && order.status !== "canceled") {
      for (const orderItem of items) {
        await Item.findByIdAndUpdate(orderItem.item, {
          $inc: { quantity: orderItem.quantity }, // Increment item quantity
        });
      }
    }

    // Then update the order with the new status or any other updated fields
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Order]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const order = await Order.findById({
      _id: req.params.id,
      organization: organizationId,
    }).populate("items.item");

    // const order = await Order.findById(req.params.id).populate("items.item");
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Iterate over each item in the order
    for (const orderItem of order.items) {
      // Update the item quantities back to the stock.
      await Item.updateOne(
        { _id: orderItem.item._id },
        {
          $inc: { quantity: orderItem.quantity },
        }
      );
    }

    // After updating item quantities, delete the order
    await Order.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerName
 *         - items
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         customerName:
 *           type: string
 *           description: Name of the customer
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - item
 *               - quantity
 *             properties:
 *               item:
 *                 type: string
 *                 description: Reference to the item ordered
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item ordered
 *         status:
 *           type: string
 *           description: Status of the order
 *       example:
 *         id: d5fE_asz
 *         customerName: John Doe
 *         items:
 *           - item: 5fE_asd8
 *             quantity: 2
 *         status: Pending
 */

module.exports = router;
