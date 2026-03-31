require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Load passport config (Google strategy)
require("./config/passport");

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

// ✅ Session + Passport
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Google OAuth routes
app.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.json({ message: "Google login successful", user: req.user });
  }
);

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
