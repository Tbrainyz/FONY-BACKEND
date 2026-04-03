const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/usersModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("=== GOOGLE PROFILE DEBUG ===");
      console.log("Display Name:", profile.displayName);
      console.log("Email:", profile.emails?.[0]?.value);
      console.log("Photos:", profile.photos);
      console.log("Picture from _json:", profile._json?.picture);
      console.log("=============================");

      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Google"), null);
        }

        const photoUrl = profile.photos?.[0]?.value || profile._json?.picture || "";

        let user = await User.findOne({ email });

        if (user) {
          let isUpdated = false;
          if (!user.googleId) { user.googleId = profile.id; isUpdated = true; }
          if (profile.displayName) { user.name = profile.displayName; isUpdated = true; }
          if (photoUrl && user.profilePicture !== photoUrl) {
            user.profilePicture = photoUrl;
            isUpdated = true;
          }
          if (isUpdated) await user.save();
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName || "Google User",
          email,
          googleId: profile.id,
          profilePicture: photoUrl,
          phone: "",
          isVerified: true,
        });

        console.log("New Google user created:", user._id);
        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error.name || "", error.message);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;