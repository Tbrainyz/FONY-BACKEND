const Notification = require("../models/notificationModel");

// Create notification
exports.createNotification = async (userId, taskId, message) => {
  return await Notification.create({
    user: userId,
    task: taskId,
    message,
  });
};

// Get notifications
exports.getNotifications = async (userId) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 });
};

// Mark as read
exports.markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};
