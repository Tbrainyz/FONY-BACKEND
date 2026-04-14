const notificationService = require("../services/notificationService");

// GET notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK as read
exports.markAsRead = async (req, res) => {
  try {
    const updated = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
