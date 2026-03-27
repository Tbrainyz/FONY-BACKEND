const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
} = require("../controllers/taskController");

// Get all tasks
router.get("/", protect, getTasks);

// Create task with optional image
router.post("/", protect, upload, createTask);

// Update task with optional image
router.put("/:id", protect, upload, updateTask);

// Complete task
router.put("/complete/:id", protect, completeTask);

// Delete task
router.delete("/:id", protect, deleteTask);

module.exports = router;