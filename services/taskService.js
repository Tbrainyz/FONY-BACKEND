const Task = require("../models/tasksModel");

// =========================
// GET TASKS (PAGINATED)
// =========================
exports.getTasks = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const priority = query.priority || "";
  const status = query.status;

  const filter = { user: userId };

  if (priority) filter.priority = priority;
  if (status !== undefined && status !== "") {
    filter.status = Number(status);
  }

  const tasks = await Task.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalTasks = await Task.countDocuments({ user: userId });
  const completedCount = await Task.countDocuments({
    user: userId,
    status: 100,
  });
  const ongoingCount = await Task.countDocuments({
    user: userId,
    status: { $lt: 100 },
  });

  const totalFiltered = await Task.countDocuments(filter);

  return {
    data: tasks,
    totalTasks,
    completedCount,
    ongoingCount,
    page,
    pages: Math.ceil(totalFiltered / limit),
    hasNextPage: page * limit < totalFiltered,
    hasPrevPage: page > 1,
  };
};

// =========================
// GET COMPLETED TASKS
// =========================
exports.getCompletedTasks = async (userId) => {
  return await Task.find({ user: userId, status: 100 }).sort({
    createdAt: -1,
  });
};

// =========================
// CREATE TASK
// =========================
exports.createTask = async (userId, body, file) => {
  const newTask = new Task({
    title: body.title,
    description: body.description,
    priority: body.priority,
    dueDate: body.dueDate || null, //
    reminderSent: false, //
    user: userId,
  });

  if (file?.cloudinaryUrl) {
    newTask.image = file.cloudinaryUrl;
  }

  await newTask.save();
  return newTask;
};


// =========================
// UPDATE TASK
// =========================
exports.updateTask = async (userId, taskId, body, file) => {
  const updateData = {
    title: body.title,
    description: body.description,
    priority: body.priority,
    status: Number(body.status) || 0,
    dueDate: body.dueDate || null,
    reminderSent: false,
  };

  if (file?.cloudinaryUrl) {
    updateData.image = file.cloudinaryUrl;
  }

  return await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    updateData,
    { new: true }
  );
};


// =========================
// COMPLETE TASK
// =========================
exports.completeTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) return null;

  task.status = 100;
  task.completed = true;
  task.completedAt = new Date();

  await task.save();
  return task;
};

// =========================
// DELETE TASK
// =========================
const Notification = require("../models/notificationModel");

exports.deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  // ✅ CLEAN UP NOTIFICATIONS
  if (task) {
    await Notification.deleteMany({ task: taskId });
  }

  return task;
};
