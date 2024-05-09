// routes/categoryRoutes.js
const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Error message
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const category = new Category({
      ...req.body,
      organization: organizationId,
    });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error message
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const categories = await Category.find({ organization: organizationId });
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Error message
 *       404:
 *         description: Category not found
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const organizationId = req.user.organizationId;
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, organization: organizationId },
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const organizationId = req.user.organizationId;

    // First, find the category to ensure it exists and belongs to the correct organization
    const category = await Category.findOne({
      _id: categoryId,
      organization: organizationId,
    });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    // If the category exists, proceed to delete it
    await Category.findByIdAndDelete({
      _id: categoryId,
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *       example:
 *         id: d5fE_asz
 *         name: Electronics
 *         description: Gadgets and electronic devices
 */

module.exports = router;
