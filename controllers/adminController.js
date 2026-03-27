const User = require("../models/usersModel");
const Task = require("../models/tasksModel");

// ALL USERS
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// PROMOTE USER
exports.makeAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.role = "admin";
  await user.save();

  res.json({ message: "User is now admin" });
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = true;
  await user.save();

  res.json({ message: "User blocked" });
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = false;
  await user.save();

  res.json({ message: "User unblocked" });
};

// ALL TASKS
exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate("user", "name email");
  res.json(tasks);
};

// TASKS PER USER
exports.getUserTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.params.userId });
  res.json(tasks);
};

// DASHBOARD
exports.getDashboard = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ completed: true });

  res.json({
    totalUsers,
    totalTasks,
    completedTasks,
  });
};