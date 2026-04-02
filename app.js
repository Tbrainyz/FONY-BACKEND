require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

// Load passport config
require("./config/passport");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Session + Passport
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Catch-all fallback (no '*' string!)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error handler
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
