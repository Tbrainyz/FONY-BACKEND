require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

require("./config/passport");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// 1. Trust proxy - VERY IMPORTANT on Render
app.set("trust proxy", 1);

// 2. MANUAL CORS (this is where you handle CORS)
app.use((req, res, next) => {
  const allowedOrigin = process.env.CLIENT_URL;

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session configuration (critical part for Render)
app.use(
  session({
    secret: process.env.JWT_SECRET || "nelly",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,           // Must be true because Render uses HTTPS
      sameSite: "none",       // Required when frontend and backend are on different domains
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);


// Error handling
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌐 Allowed origin: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
};

startServer();