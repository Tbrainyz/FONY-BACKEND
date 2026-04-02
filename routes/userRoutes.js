const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // streamifier version

const {
  updateProfile,
  registerUser,
  loginUser,
  googleCallback,
  googleAuth,
  forgotPassword,
  resetPassword,
  resendOTP,
  deleteUserByEmail,
  changePassword, // ✅ new controller
} = require("../controllers/userController");

// ================= REGISTRATION & LOGIN =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= GOOGLE AUTH =================
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// ================= PASSWORD MANAGEMENT =================
router.post("/users/forgot-password", forgotPassword);
router.post("/users/resend-otp", resendOTP);
router.post("/users/reset-password", resetPassword);
router.post("/users/change-password", protect, changePassword); // ✅ new route

// ================= PROFILE MANAGEMENT =================
router.put("/users/profile", protect, upload, updateProfile); // <-- handles image upload
router.delete("/users/delete-user", deleteUserByEmail);

module.exports = router;
