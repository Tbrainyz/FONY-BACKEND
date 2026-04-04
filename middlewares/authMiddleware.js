const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "Not authorized, user not found",
        });
      }

      // 🔥🔥 CRITICAL FIX
      if (user.isBlocked) {
        return res.status(403).json({
          message: "Your account has been blocked by admin",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

module.exports = protect;