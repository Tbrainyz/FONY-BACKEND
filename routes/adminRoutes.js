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
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getUsers);          // paginated users with task counts
router.get("/dashboard", getDashboard);  // summary stats
router.get("/all-users", getAllUsers);   // raw all users
router.get("/tasks", getAllTasks);       // all tasks (admin view)
router.get("/tasks/:userId", getUserTasks); // tasks for specific user
router.put("/make-admin/:id", makeAdmin);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

module.exports = router;
