require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Explicit CORS configuration
const allowedOrigins = [
  "http://localhost:5173",           // React dev server
  "https://your-frontend-domain.com" // add your deployed frontend here
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Error handler (keep last so CORS headers are already set)
app.use((err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: err,
  });
});

// ✅ Start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
