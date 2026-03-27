require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoute = require("./routes/adminRoutes")




const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: err,
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

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

