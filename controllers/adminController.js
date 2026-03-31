const User = require("../models/usersModel");
const Task = require("../models/tasksModel");

// DASHBOARD SUMMARY
exports.getDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const tasksCount = await Task.countDocuments();
    const completedCount = await Task.countDocuments({ status: 100 });
    const ongoingCount = await Task.countDocuments({ status: { $lt: 100 } });

    res.json({ usersCount, tasksCount, completedCount, ongoingCount });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
};

// PAGINATED USERS WITH TASK COUNTS
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("name email profilePicture createdAt role blocked");

    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const totalTasks = await Task.countDocuments({ user: user._id });
        const completedTasks = await Task.countDocuments({ user: user._id, status: 100 });
        return { ...user.toObject(), totalTasks, completedTasks };
      })
    );

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({ users: usersWithTasks, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// RAW ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role blocked createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all users", error: err.message });
  }
};

// PROMOTE USER TO ADMIN
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user role", error: err.message });
  }
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked", user });
  } catch (err) {
    res.status(500).json({ message: "Error blocking user", error: err.message });
  }
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unblocked", user });
  } catch (err) {
    res.status(500).json({ message: "Error unblocking user", error: err.message });
  }
};

// GET ALL TASKS (ADMIN VIEW)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// GET TASKS FOR A SPECIFIC USER
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user tasks", error: err.message });
  }
};
