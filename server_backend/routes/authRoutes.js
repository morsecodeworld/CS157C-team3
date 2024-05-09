// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const { requireAuth, requireRole } = require("../middleware/auth");
const sendEmail = require("../utils/email");

const router = express.Router();

// Check if the JWT secret is available before starting the server
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined.");
    process.exit(1);
}

/**
 * Register a new user
 */
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, organizationName, country, currency } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const organization = await Organization.findOneAndUpdate(
            { name: organizationName },
            {},
            { upsert: true, new: true }
        );

        console.log("Password to be stored:", password); // Debugging log

        const newUser = new User({
            username,
            email,
            password, // Store password as plain string
            organization: organization._id,
            country,
            currency,
        });
        await newUser.save();

        console.log("User registered successfully:", newUser); // Debugging log

        const token = jwt.sign(
            { userId: newUser._id, organizationId: organization._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(201).json({ token });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send("Failed to register user");
    }
});

/**
 * Login user and return JWT
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User does not exist");
        }

        console.log("Stored password:", user.password); // Debugging log
        console.log("Password provided:", password); // Debugging log

        // Compare passwords as plain strings
        if (user.password !== password) {
            console.log("Invalid password"); // Debugging log
            return res.status(400).send("Invalid credentials");
        }

        console.log("Login successful"); // Debugging log

        const token = jwt.sign(
            { userId: user._id, organizationId: user.organization },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Failed to log in");
    }
});

module.exports = router;
