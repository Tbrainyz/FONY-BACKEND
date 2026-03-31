const Task = require("../models/tasksModel");

// GET all tasks (with pagination + optional filters)
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const priority = req.query.priority || "";
    const status = req.query.status || null;

    const filter = {};
    if (priority) filter.priority = priority;
    if (status !== null) filter.status = Number(status); // numeric status

    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Counts based on numeric status
    const totalTasks = await Task.countDocuments();
    const completedCount = await Task.countDocuments({ status: 100 });
    const ongoingCount = await Task.countDocuments({ status: { $lt: 100 } });

    const totalFiltered = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalFiltered / limit);

    res.json({
      data: tasks,
      totalTasks,
      completedCount,
      ongoingCount,
      page,
      pages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// GET completed tasks
exports.getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 100 }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching completed tasks", error: err.message });
  }
};


// ================= CREATE TASK =================
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const newTask = new Task({
      title,
      description,
      priority,
      user: req.user._id,
    });

    // ✅ Store Cloudinary URL if image uploaded
    if (req.file?.cloudinaryUrl) {
      newTask.image = req.file.cloudinaryUrl;
    }

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// UPDATE task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status: Number(status) },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// MARK task as completed
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = 100; // numeric completed
    await task.save();
    res.json({ message: "Task marked as completed", task });
  } catch (err) {
    res.status(500).json({ message: "Error completing task", error: err.message });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};
