require("dotenv").config();

  
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

require("./config/passport");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ==================== TRUST PROXY ====================
app.set("trust proxy", 1);

// ==================== IMPROVED CORS ====================
const allowedOrigins = [
  process.env.CLIENT_URL,                    // Production frontend (e.g. https://yourdomain.com)
  "http://localhost:5174",                   // Vite default
  "http://localhost:3000",                   // React default (just in case)
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000"
].filter(Boolean); // Remove undefined/null values

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow request if origin is in our allowed list OR if no origin (like Postman)
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    // For safety, you can also block unknown origins, but for development it's better to allow
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

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
app.use("/api/notifications", notificationRoutes);

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
    console.log("✅ MongoDB connected successfully");

    require("./jobs/reminderJobs");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌐 Allowed Origins:`);
      allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });