const Message = require('../models/Message');
const mapper = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messagesTmp = await Message.find({chat: ctx.user.id}).limit(20);
  const messages = [];
  if (messagesTmp.length) {
    messagesTmp.forEach(function(message) {
      messages.push(mapper(message));
    });
  }
  ctx.body = {messages};
};
