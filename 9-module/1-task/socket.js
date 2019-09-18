const socketIO = require('socket.io');


const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }
    const session = await Session.findOne({token}).populate('user').exec();
    socket.user = {
      id: session.user._id,
      displayName: session.user.displayName,
    };
    return next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const message = new Message({
        text: msg,
        user: socket.user.displayName,
        chat: socket.user.id,
        date: new Date(),
      });
      await message.save();
      socket.broadcast.emit('message', {from: msg.from, message: msg.message});
    });
  });

  return io;
}

module.exports = socket;
