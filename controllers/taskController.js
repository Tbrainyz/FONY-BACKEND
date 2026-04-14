const taskService = require("../services/taskService");

// =========================
// GET TASKS
// =========================
exports.getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.user._id, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET COMPLETED TASKS
// =========================
exports.getCompletedTasks = async (req, res) => {
  try {
    const tasks = await taskService.getCompletedTasks(req.user._id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// CREATE TASK
// =========================
exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(
      req.user._id,
      req.body,
      req.file
    );

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// UPDATE TASK
// =========================
exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.user._id,
      req.params.id,
      req.body,
      req.file
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not owned by you",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// COMPLETE TASK
// =========================
exports.completeTask = async (req, res) => {
  try {
    const task = await taskService.completeTask(
      req.user._id,
      req.params.id
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task completed successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// DELETE TASK
// =========================
exports.deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(
      req.user._id,
      req.params.id
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
