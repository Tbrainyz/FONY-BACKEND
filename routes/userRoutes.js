const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const passport = require("../config/passport");

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

// Registration & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth
router.get("/google", googleAuth);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback
);

// Other routes
router.post("/forgot-password", forgotPassword);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.put("/profile", protect, upload, updateProfile);
router.delete("/delete-user", deleteUserByEmail);

module.exports = router;