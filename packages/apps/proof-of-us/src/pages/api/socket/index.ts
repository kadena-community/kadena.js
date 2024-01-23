import type { Server as IHTTPServer } from 'http';
import type { Socket as INetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as IOServer } from 'socket.io';
import { Server } from 'socket.io';

const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

  const createProofOfUs = (tokenId: string, account: IProofOfUsSignee) => {
    if (store[tokenId]) return;
    store[tokenId] = {
      tokenId,
      date: Date.now(),
      signees: [account],
    };
  };

  const getProofOfUs = (tokenId: string) => {
    console.log(store);
    return store[tokenId];
  };

  const addSignee = (tokenId: string, account: IProofOfUsSignee) => {
    console.log(store);
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.key === account.key)) return;

    store[tokenId].signees = [...signeesList, account];
  };

  const removeSignee = (tokenId: string, account: IProofOfUsSignee) => {
    console.log(store);
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    store[tokenId].signees = [
      ...signeesList.filter((s) => s.key !== account.key),
    ];
  };

  return { createProofOfUs, getProofOfUs, addSignee, removeSignee };
};

const store = ProofOfUsStore();

interface ISocketServer extends IHTTPServer {
  io?: IOServer | undefined;
}

interface ISocketWithIO extends INetSocket {
  server: ISocketServer;
}

interface INextApiResponseWithSocket extends NextApiResponse {
  socket: ISocketWithIO;
}

export default function SocketHandler(
  _: NextApiRequest,
  res: INextApiResponseWithSocket,
) {
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
    console.log('connection');
    socket.join(socket.handshake.auth.tokenId);

    io.to(socket.handshake.auth.tokenId)
      .to(socket.handshake.auth.tokenId)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(socket.handshake.auth.tokenId),
        from: socket.handshake.auth.tokenId,
      });

    socket.on('createToken', ({ content, to }) => {
      store.createProofOfUs(to, content);
      io.to(to)
        .to(to)
        .emit('getProofOfUs', {
          content: store.getProofOfUs(to),
          from: socket.handshake.auth.tokenId,
        });
    });

    socket.on('addSignee', ({ content, to }) => {
      store.addSignee(to, content);
      io.to(to)
        .to(to)
        .emit('getProofOfUs', {
          content: store.getProofOfUs(to),
          from: socket.handshake.auth.tokenId,
        });
    });

    socket.on('removeSignee', ({ content, to }) => {
      store.removeSignee(to, content);
      io.to(to)
        .to(to)
        .emit('getProofOfUs', {
          content: store.getProofOfUs(to),
          from: socket.handshake.auth.tokenId,
        });
    });
  });

  console.log('Setting up socket');
  res.end();
}
