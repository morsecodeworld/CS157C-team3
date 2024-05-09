const express = require("express");
const Organization = require("../models/Organization");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Fetches all organizations
 *     tags: [Organization]
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: A list of organizations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The organization ID.
 *                   name:
 *                     type: string
 *                     description: The name of the organization.
 *       401:
 *         description: Unauthorized. Token not found or is invalid.
 *       403:
 *         description: Forbidden. User does not have the right role.
 *       500:
 *         description: Server error. Error message in the response body.
 */
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).send("An error occurred while fetching organizations.");
  }
});

module.exports = router;
