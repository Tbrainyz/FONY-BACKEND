const express = require("express");
const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const {
  getAllUsers,
  makeAdmin,
  blockUser,
  unblockUser,
  getAllTasks,
  getUserTasks,
  getDashboard,
} = require("../controllers/adminController");

const router = express.Router();

// USERS
router.get("/users", protect, admin, getAllUsers);
router.put("/make-admin/:id", protect, admin, makeAdmin);
router.put("/block/:id", protect, admin, blockUser);
router.put("/unblock/:id", protect, admin, unblockUser);

// TASKS
router.get("/tasks", protect, admin, getAllTasks);
router.get("/tasks/user/:userId", protect, admin, getUserTasks);

// DASHBOARD
router.get("/dashboard", protect, admin, getDashboard);

module.exports = router;