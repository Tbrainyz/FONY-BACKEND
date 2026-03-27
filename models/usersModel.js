const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
     role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    isBlocked: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId; // password not required for Google users
      },
    },

    // ✅ Google Auth
    googleId: {
      type: String,
    },

    // ✅ Account verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,

    // ✅ Password reset (Brevo OTP)
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ✅ Profile Image (Cloudinary URL)
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
