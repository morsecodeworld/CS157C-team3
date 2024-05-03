const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  user,
  loggedIn,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect, authGuard } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);  
router.get("/profile", protect, authGuard(['user']), user);  
router.get("/loggedin", protect, loggedIn);  
router.patch("/update-profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Error handling middleware 
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = router;
