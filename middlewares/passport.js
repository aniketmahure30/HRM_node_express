const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const UserSchema = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await UserSchema.findOne({ email });
        // checking user exits or not
        if (!user) {
         return done(null, false, { message: "User not exits" });
        }
        // else {
        //     done(null, user, "Successfully Logged in");
        // }

        //!=====>  Match password in DB
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
            if (!isMatch)
                return done(null, false, { message: "Password is not match" });
            else
                return done(null, user);
        });
      }
    )
  );
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserSchema.findById(id, function (err,user) {
      done(err,user)
  });
});
