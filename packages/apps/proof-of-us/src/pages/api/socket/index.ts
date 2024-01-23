import { Server } from 'socket.io';

const TokenStore = () => {
  const tokens = [];
  const createSession = () => {};
  const getSession = () => {};
  return {
    createSession,
    getSession,
  };
};

export default function SocketHandler(req, res) {
  const tokenStore = TokenStore();

  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  res.socket.server.io = io;

  io.use((socket, next) => {
    const tokenId = socket.handshake.auth.tokenId;

    if (!tokenId) {
      return next(new Error('invalid token. not found'));
    }

    next();
  });

  io.on('connection', (socket) => {
    socket.join('TOKENID2');
    socket.on('send-message', (obj) => {
      io.emit('receive-message', obj);
    });

    io.emit('user connected', {
      tokenId: socket.handshake.auth.tokenId,
    });

    socket.on('private message', ({ content, to }) => {
      console.log({ content, to });
      socket.to(to).to(to).emit('private message', {
        content,
        from: socket.handshake.auth.tokenId,
      });
    });

    const users = [];
    for (const [id, socket] of io.of('/').sockets) {
      users.push({
        userID: id,
      });
    }

    socket.emit('users', users);
  });

  console.log('Setting up socket');
  res.end();
}
