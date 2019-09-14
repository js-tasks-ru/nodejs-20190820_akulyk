const uuid = require('uuid/v4');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;

  let user = await User.findOne({email});
  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
    return;
  }
  const verificationToken = uuid();
  user = new User({email, displayName, verificationToken});
  await user.setPassword(password);
  await user.save();
  await sendMail({
    to: email,
    subject: 'Please, confirm your email!',
    template: 'confirmation',
    locals: {token: verificationToken},
  });
  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  let verificationToken = ctx.params.token;
  if (! verificationToken) {
    verificationToken = ctx.query.verificationToken;
  }

  if (! verificationToken) {
    verificationToken = ctx.request.body.verificationToken;
  }

  const user = await User.findOne({verificationToken});
  if (! user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();
  const sessionToken = uuid();
  const session = await Session.create({
    token: sessionToken,
    user: user._id,
    lastVisit: new Date(),
  });

  ctx.status = 200;
  ctx.body = {token: sessionToken};
};
