class AuthError extends Error {
  constructor(message = 'Пользователь не залогинен') {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  AuthError,
  mustBeAuthenticated: function mustBeAuthenticated(ctx, next) {
    if (!ctx.user) {
      throw new AuthError();
    }
    return next();
  },
};

