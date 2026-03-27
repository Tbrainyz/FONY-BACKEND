const Task = require("../models/tasksModel");

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      user: req.user._id,
      image: req.file?.cloudinaryUrl || null,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("Create task error:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};


// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, status, completed, priority } = req.query;

    const query = { user: req.user._id };

    // 🔹 Filters
    if (status !== undefined) query.status = Number(status);
    if (completed !== undefined) query.completed = completed === "true";
    if (priority) query.priority = priority;

    // 🔹 Pagination (FIXED LIMIT = 10)
    const pageNumber = Number(page) || 1;
    const limit = 10; // FIXED

    const skip = (pageNumber - 1) * limit;

    // 🔹 Total tasks
    const total = await Task.countDocuments(query);

    // 🔹 Fetch tasks
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page: pageNumber,
      pages: Math.ceil(total / limit),
      total,
      count: tasks.length,
      hasNextPage: pageNumber < Math.ceil(total / limit),
      hasPrevPage: pageNumber > 1,
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Mark task as complete
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = 100;
    await task.save();

    res.status(200).json({ message: "Task marked as complete", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to complete task", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (req.file?.cloudinaryUrl) task.image = req.file.cloudinaryUrl;

    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};
