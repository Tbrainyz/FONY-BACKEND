const express = require("express");
const {
  getAllUsers,
  makeAdmin,
  blockUser,
  unblockUser,
  getAllTasks,
  getUserTasks,
  getDashboard,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔐 Protect ALL admin routes
router.use(protect);

// ==================== GET ROUTES ====================
router.get("/users", getUsers);
router.get("/dashboard", getDashboard);
router.get("/all-users", getAllUsers);
router.get("/tasks", getAllTasks);
router.get("/tasks/:userId", getUserTasks);

// ==================== USER ACTIONS ====================
router.put("/make-admin/:id", makeAdmin);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

// ==================== DELETE ====================
router.delete("/delete/:id", deleteUser);

module.exports = router;