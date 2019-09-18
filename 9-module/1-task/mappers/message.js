
module.exports = function mapMessage(message) {
  return {
    id: message.id,
    user: message.user,

    text: message.text,
    date: message.date,
  };
};
