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
  deleteUser, // ✅ added
} = require("../controllers/adminController");

const router = express.Router();

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

// ==================== DELETE USER ====================
router.delete("/delete/:id", deleteUser); // 🔥 important

module.exports = router;