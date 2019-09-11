const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
    },
    async function(email, password, done) {
      try {
        const user = await User.login(email, password);
        if (user) {
          return done(null, user);
        }
      } catch (e) {
        return done(null, false, e.message);
      }
      done();
    }
);
