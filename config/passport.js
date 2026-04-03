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
      console.log("Google user:", profile);

      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        let user = await User.findOne({ email });

        if (user) {
          // Update fields if missing
          if (!user.googleId) {
            user.googleId = profile.id;
          }
          if (!user.name) {
            user.name = profile.displayName;
          }
          if (!user.profilePicture && profile.photos?.[0]?.value) {
            user.profilePicture = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // Create new user if not found
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          profilePicture: profile.photos?.[0]?.value || "",
          phone: "", // Google doesn't provide phone, leave blank
        });

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;