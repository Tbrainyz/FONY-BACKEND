const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/usersModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // ✅ DEBUG LOG (VERY IMPORTANT)
      console.log("Google user:", profile);

      try {
        const email = profile.emails?.[0]?.value;

        // ❌ If Google didn't return email
        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        // 🔍 Check if user already exists (by googleId OR email)
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // ✅ If user exists but no googleId, update it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        }

        // 🆕 Create new user
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error); // ✅ extra debug
        return done(error, null);
      }
    }
  )
);

module.exports = passport;