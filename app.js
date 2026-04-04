require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

require("./config/passport");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ==================== TRUST PROXY ====================
app.set("trust proxy", 1);

// ==================== CORS ====================
app.use((req, res, next) => {
  const allowedOrigin = process.env.CLIENT_URL;

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// ==================== BODY PARSER ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== PASSPORT ====================
app.use(passport.initialize());

// ==================== ROUTES ====================
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ==================== KEEP ALIVE ROUTE ====================
app.get("/ping", (req, res) => {
  res.status(200).send("Server is awake 🚀");
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// ==================== START SERVER ====================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌐 Allowed origin: ${process.env.CLIENT_URL}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });