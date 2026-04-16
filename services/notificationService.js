const Notification = require("../models/notificationModel");

// ================= CREATE =================
exports.createNotification = async (userId, taskId, message) => {
  return await Notification.create({
    user: userId,
    task: taskId,
    message,
    read: false,
  });
};

// ================= GET =================
exports.getNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
};

// ================= MARK AS READ =================
exports.markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};

// ================= DELETE SINGLE =================
exports.deleteNotification = async (notificationId, userId) => {
  return await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
};

// ================= CLEAR ALL =================
exports.clearAllNotifications = async (userId) => {
  return await Notification.deleteMany({
    user: userId,
  });
};
