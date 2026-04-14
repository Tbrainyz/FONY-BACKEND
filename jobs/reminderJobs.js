const cron = require("node-cron");
const Task = require("../models/tasksModel");
const notificationService = require("../services/notificationService");

// Runs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      completed: false,
      dueDate: { $lte: now },
      reminded: false,
    });

    for (const task of tasks) {
      await notificationService.createNotification(
        task.user,
        task._id,
        `⏰ Reminder: "${task.title}" is due or overdue`
      );

      task.reminded = true;
      await task.save();
    }

    console.log("🔔 Reminder job executed");
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
});
