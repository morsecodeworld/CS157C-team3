// routes/itemRoutes.js
const express = require("express");
const Item = require("../models/Item");
const { requireAuth, requireRole } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Item]
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Error message
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const itemData = { ...req.body, organization: organizationId };
    const item = new Item(itemData);
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items with optional filtering, sorting, and pagination
 *     tags: [Item]
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
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: Sorting parameter
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         required: false
 *         description: Sorting order (asc or desc)
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Error message
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;
    const organizationId = req.user.organizationId; // Ensure your auth middleware sets this
    const queryOptions = { organization: organizationId, ...req.query };

    const items = await Item.find(queryOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sort]: order === "desc" ? -1 : 1 });
    const count = await Item.countDocuments(queryOptions);
    res.status(200).json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get an item by ID, scoped to the user's organization
 *     tags: [Item]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item data, scoped to the user's organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Error message
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;
    const item = await Item.findOne({ _id: id, organization: organizationId });
    if (!item) {
      return res
        .status(404)
        .send("Item not found or not part of your organization");
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Item]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Error message
 *       404:
 *         description: Item not found
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const item = await Item.findOneAndUpdate(
      { _id: id, organization: organizationId },
      req.body,
      { new: true }
    );
    if (!item) {
      return res
        .status(404)
        .send("Item not found or not part of your organization");
    }

    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Item]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       204:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const item = await Item.findOneAndDelete({
      _id: id,
      organization: organizationId,
    });
    if (!item) {
      return res
        .status(404)
        .send("Item not found or not part of your organization");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - buyPrice
 *         - sellPrice
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the item
 *         description:
 *           type: string
 *           description: Description of the item
 *         quantity:
 *           type: number
 *           description: Stock level of the item
 *         buyPrice:
 *           type: number
 *           format: double
 *           description: Buying price of the item
 *         sellPrice:
 *           type: number
 *           format: double
 *           description: Selling price of the item
 *         category:
 *           type: string
 *           description: Category ID the item belongs to
 *         supplier:
 *           type: string
 *           description: Supplier ID of the item
 *       example:
 *         name: "LED Bulb"
 *         description: "A 7W LED bulb"
 *         quantity: 150
 *         buyPrice: 2.50
 *         sellPrice: 2.99
 *         category: "5f8d040ac2a6a50b5c3b9ebe"
 *         supplier: "5f8d03afc2a6a50b5c3b9ebd"
 */
module.exports = router;
