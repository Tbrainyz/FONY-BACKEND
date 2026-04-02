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

        // Check if user already exists by email
        let user = await User.findOne({ email });

        if (user) {
          // If user exists, we update fields if they are missing or stale
          const updatedFields = {
            name: profile.displayName || user.name,
            profilePicture: profile.photos?.[0]?.value || user.profilePicture,
            googleId: profile.id, // Ensure Google ID is always linked
            email: email, // Confirm email is still correct
            phone: user.phone || "", // If phone was already set, keep it
          };

          // Update the user only if fields need updating
          // (e.g., no need to overwrite a name if it's already set)
          let needUpdate = false;
          if (!user.name && updatedFields.name) {
            user.name = updatedFields.name;
            needUpdate = true;
          }
          if (!user.profilePicture && updatedFields.profilePicture) {
            user.profilePicture = updatedFields.profilePicture;
            needUpdate = true;
          }
          if (user.googleId !== profile.id) {
            user.googleId = profile.id;
            needUpdate = true;
          }

          if (needUpdate) {
            await user.save();
          }

          return done(null, user);
        }

        // If user doesn't exist, create a new one with Google details
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          profilePicture: profile.photos?.[0]?.value || "",
          phone: "", // No phone data from Google, leave blank
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