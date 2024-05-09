// routes/supplierRoutes.js
const express = require("express");
const Supplier = require("../models/Supplier");
const router = express.Router();

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Add a new supplier
 *     tags: [Supplier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier added successfully
 *       400:
 *         description: Error message
 */
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).send(supplier);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     responses:
 *       200:
 *         description: A list of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *       500:
 *         description: Error message
 */
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).send(suppliers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Update a supplier by ID
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Error message
 *       404:
 *         description: Supplier not found
 */
router.put("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send(supplier);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier by ID
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
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
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the supplier
 *         name:
 *           type: string
 *           description: The name of the supplier
 *         contactName:
 *           type: string
 *           description: The contact person's name at the supplier
 *         address:
 *           type: string
 *           description: The supplier's address
 *         phone:
 *           type: string
 *           description: The supplier's phone number
 *         email:
 *           type: string
 *           description: The supplier's email address
 *       example:
 *         id: d5fE_asz
 *         name: Best Electronics
 *         contactName: John Doe
 *         address: 123 Tech Rd, Silicon Valley
 *         phone: 123-456-7890
 *         email: contact@bestelectronics.com
 */

module.exports = router;
