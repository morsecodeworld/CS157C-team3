const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Middleware for authentication
const requireAuth = async (req, res, next) => {
  // Extracting the token from the "Authorization" header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally, verify user exists and get fresh user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).send("User not found.");
    }

    // Attach user and organizationId to request
    req.user = {
      userId: user._id,
      role: user.role,
      organizationId: user.organization,
    };
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

const requireRole = (role) => (req, res, next) => {
  User.findById(req.user.userId)
    .then((user) => {
      if (user && user.role === role) {
        next();
      } else {
        res.status(403).send("Access Denied: You don't have the correct role");
      }
    })
    .catch((error) => {
      console.error("Authentication error: ", error);
      res.status(500).send(error.message);
    });
};

module.exports = {
  requireAuth,
  requireRole,
};