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
      console.log("Full Profile:", JSON.stringify(profile, null, 2));
      console.log("=============================");

      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        // Better photo extraction - Google often puts it in _json
        const photoUrl = 
          profile.photos?.[0]?.value || 
          profile._json?.picture || 
          profile._json?.image?.url || 
          "";

        let user = await User.findOne({ email });

        if (user) {
          let isUpdated = false;

          if (!user.googleId) {
            user.googleId = profile.id;
            isUpdated = true;
          }

          // Force sync name and picture on every Google login
          if (profile.displayName) {
            user.name = profile.displayName;
            isUpdated = true;
          }

          if (photoUrl) {
            user.profilePicture = photoUrl;
            isUpdated = true;
          }

          if (isUpdated) {
            await user.save();
            console.log("✅ Existing user updated with Google name & picture");
          }

          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName || "Google User",
          email,
          googleId: profile.id,
          profilePicture: photoUrl,
          phone: "",
          isVerified: true,        // Important - match your register logic
        });

        console.log("✅ New Google user created:", user._id);
        return done(null, user);

      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// For JWT (session: false)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;