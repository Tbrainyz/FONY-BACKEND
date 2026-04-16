const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");

// ================= GET ALL =================
router.get("/", protect, getNotifications);

// ================= MARK AS READ =================
router.put("/:id/read", protect, markAsRead);

// ================= DELETE ONE =================
router.delete("/:id", protect, deleteNotification);

// ================= CLEAR ALL =================
router.delete("/", protect, clearAllNotifications);

module.exports = router;
