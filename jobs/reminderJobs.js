const cron = require("node-cron");
const Task = require("../models/tasksModel");
const notificationService = require("../services/notificationService");

// Runs every 10 minutes
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      status: { $lt: 100 },
      dueDate: { $lte: now },
      reminderSent: false,
    });

    for (const task of tasks) {
      await notificationService.createNotification(
        task.user,
        task._id,
        `⏰ Reminder: "${task.title}" is due or overdue`
      );

      task.reminderSent = true;
      await task.save();
    }

    console.log("🔔 Reminder job executed", tasks.length);
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
});

