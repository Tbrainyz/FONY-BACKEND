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
  "http://localhost:5174",           // React dev server
  "https://your-frontend-domain.com" ,// add your deployed frontend here
  "https://fony-frontend-767q.vercel.app" // Vercel deployment
];
app.use(cors({
  origin: ["https://your-vercel-app.vercel.app"],
  credentials: true,
}));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ❌ Remove this line completely:
// app.options("*", cors());

app.use(express.json());

// ✅ Session + Passport
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
const path = require("path");

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Google OAuth routes
// app.get("/api/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get("/api/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.json({ message: "Google login successful", user: req.user });
//   }
// );

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
