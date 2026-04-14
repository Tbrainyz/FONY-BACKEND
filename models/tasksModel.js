const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    image: {
      type: String, // stores Cloudinary URL
      default: null,
    },

    status: {
      type: Number,
      enum: [0, 25, 50, 75, 100],
      default: 0,
    },
    dueDate: {
      type: Date,
      required: false,
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
