const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // streamifier version
const { updateProfile, registerUser, loginUser, googleAuth, forgotPassword, resetPassword, deleteUserByEmail } = require("../controllers/userController");

// ================= REGISTRATION & LOGIN =================
router.post("/register", registerUser);
router.delete("/delete-user", deleteUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);

// ================= PROFILE UPDATE =================
router.put("/profile", protect, upload, updateProfile); // <-- no .single()

module.exports = router;