const User = require("../models/usersModel");
const Task = require("../models/tasksModel");

// ================= ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// ================= PROMOTE USER =================
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();
    res.json({ message: "User is now admin" });
  } catch (err) {
    res.status(500).json({ message: "Error promoting user", error: err.message });
  }
};

// ================= BLOCK USER =================
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    await user.save();
    res.json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ message: "Error blocking user", error: err.message });
  }
};

// ================= UNBLOCK USER =================
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();
    res.json({ message: "User unblocked" });
  } catch (err) {
    res.status(500).json({ message: "Error unblocking user", error: err.message });
  }
};

// ================= ALL TASKS =================
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// ================= TASKS PER USER =================
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user tasks", error: err.message });
  }
};

// ================= DASHBOARD SUMMARY =================
exports.getDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const tasksCount = await Task.countDocuments();
    const completedCount = await Task.countDocuments({ status: "completed" });
    const ongoingCount = await Task.countDocuments({ status: "ongoing" });

    res.json({ usersCount, tasksCount, completedCount, ongoingCount });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
};

// ================= PAGINATED USERS WITH TASK COUNTS =================
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("name email profilePicture createdAt role");

    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const totalTasks = await Task.countDocuments({ user: user._id });
        const completedTasks = await Task.countDocuments({ user: user._id, status: "completed" });
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
