const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); 
// Register User
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ user: user._id, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: "1h" });
        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Logout User
exports.logout = async (req, res) => {
    // Logout logic here TBD
    res.status(200).json({ message: "Successfully logged out" });
};

// Get User Profile
exports.user = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
};

// Check if User is Logged In
exports.loggedIn = async (req, res) => {
    // Implement logic to check if user is logged in
    res.status(200).json({ isLoggedIn: true }); // Placeholder response
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, { name, email }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user profile" });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.userId);
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to change password" });
    }
};


exports.forgotPassword = async (req, res) => {
    // Forgot password logic here TBD
    res.status(200).json({ message: "Password reset link sent" });
};


exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    // Reset password logic here TBD
    res.status(200).json({ message: "Password has been reset" });
};
