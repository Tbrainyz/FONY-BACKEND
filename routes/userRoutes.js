const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Import passport here
const passport = require("../config/passport");   // ← Add this line

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
  changePassword,
} = require("../controllers/userController");

// ================= REGISTRATION & LOGIN =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= GOOGLE AUTH =================
router.get("/google", googleAuth);

// Google Callback Route - Fixed & Clean
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback
);

// ================= PASSWORD MANAGEMENT =================
router.post("/forgot-password", forgotPassword);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);

// ================= PROFILE MANAGEMENT =================
router.put("/profile", protect, upload, updateProfile);
router.delete("/delete-user", deleteUserByEmail);

module.exports = router;