const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (! email) {
    return done(null, false, 'Не указан email');
  }
  (async () => {
    try {
      let user = await User.findOne({email: email});
      if (!user) {
        user = await User.create({email, displayName});
      }
      return done(null, user);
    } catch (e) {
      return done(e, false, e.message);
    }
  })(strategy, email, displayName, done);
};
