const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  forgotPassword,
  verifyOTP,           
  resetPassword,
  resendOTP,
  changePassword,
  updateProfile,
} = require("../controllers/userController");

// ================= REGISTRATION & LOGIN =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= GOOGLE AUTH =================
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// ================= PASSWORD MANAGEMENT =================
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);           // ← NEW ROUTE
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOTP);
router.post("/change-password", protect, changePassword);

// ================= PROFILE MANAGEMENT =================
router.put("/profile", protect, upload, updateProfile);

module.exports = router;