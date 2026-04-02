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

// ====================== MANUAL CORS MIDDLEWARE ======================
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  // Allow only your frontend (most secure)
  if (origin === process.env.CLIENT_URL) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    // For development or testing, you can temporarily allow all (not recommended in production)
    // res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

// Apply CORS middleware FIRST
app.use(corsMiddleware);

// ====================== BODY PARSERS ======================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ====================== SESSION & PASSPORT ======================
app.use(
  session({
    secret: process.env.JWT_SECRET || "fallbackSecretChangeInProduction",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ====================== ROUTES ======================
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// Support without /api in case your frontend is calling /users/login
app.use("/users", userRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================== ERROR HANDLING ======================
app.use((req, res) => {
  console.log(`404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// ====================== START SERVER ======================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌐 Allowed Frontend: ${process.env.CLIENT_URL}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();