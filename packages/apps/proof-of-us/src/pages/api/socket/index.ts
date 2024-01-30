import type { IFabricCanvasObject } from '@/fabricTypes';
import type { IProofOfUs, IProofOfUsSignee } from '@/types';
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
      signees: [{ ...account, initiator: true }],
      avatar: {
        background: '',
        objects: [],
      },
    };
  };

  const getProofOfUs = (tokenId: string) => {
    return store[tokenId];
  };

  const addBackground = (tokenId: string, background: string) => {
    const avatar = store[tokenId]?.avatar;

    store[tokenId].avatar = { ...avatar, background };
  };

  const addObject = (
    tokenId: string,
    newState: IFabricCanvasObject,
    previousState: IFabricCanvasObject,
  ) => {
    const avatar = store[tokenId]?.avatar;

    delete newState.previousState;
    delete previousState?.previousState;

    if (previousState) {
      const newObjects = avatar.objects.map((state) => {
        delete state.previousState;
        return JSON.stringify(state) === JSON.stringify(previousState)
          ? newState
          : state;
      });
      store[tokenId].avatar = { ...avatar, objects: newObjects };
      return;
    }

    store[tokenId].avatar = {
      ...avatar,
      objects: [...avatar.objects, newState],
    };
  };

  const addSignee = (tokenId: string, account: IProofOfUsSignee) => {
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

    store[tokenId].signees = [...signeesList, { ...account, initiator: false }];
  };

  const removeSignee = (tokenId: string, account: IProofOfUsSignee) => {
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    store[tokenId].signees = [
      ...signeesList.filter((s) => s.cid !== account.cid),
    ];
  };

  return {
    createProofOfUs,
    getProofOfUs,
    addSignee,
    removeSignee,
    addBackground,

    addObject,
  };
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

    socket.on('setBackground', ({ content, to }) => {
      store.addBackground(to, content.bg);
      io.to(to)
        .to(to)
        .emit('getProofOfUs', {
          content: store.getProofOfUs(to),
          from: socket.handshake.auth.tokenId,
        });
    });

    socket.on('addObject', ({ content: { newState, previousState }, to }) => {
      store.addObject(to, newState, previousState);
      socket
        .to(to)
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
