const notificationService = require("../services/notificationService");

// ================= GET =================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications(
      req.user._id
    );

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= MARK AS READ =================
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

// ================= DELETE ONE =================
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await notificationService.deleteNotification(
      req.params.id,
      req.user._id
    );

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CLEAR ALL =================
exports.clearAllNotifications = async (req, res) => {
  try {
    await notificationService.clearAllNotifications(req.user._id);

    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
