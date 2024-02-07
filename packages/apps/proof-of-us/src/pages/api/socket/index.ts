import { avatarListeners } from '@/utils/socket/avatar';
import { signeeListeners } from '@/utils/socket/signers';
import { store } from '@/utils/socket/store';
import type { Server as IHTTPServer } from 'http';
import type { Socket as INetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as IOServer } from 'socket.io';
import { Server } from 'socket.io';

export interface ISocketServer extends IHTTPServer {
  io?: IOServer | undefined;
}

export interface ISocketWithIO extends INetSocket {
  server: ISocketServer;
}

export interface INextApiResponseWithSocket extends NextApiResponse {
  socket: ISocketWithIO;
}

export default function SocketHandler(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _: NextApiRequest,
  res: INextApiResponseWithSocket,
) {
  if (res.socket.server.io) {
    console.log('Already set up!');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    maxHttpBufferSize: 1e8,
    path: '/api/socket_io',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.use((socket, next) => {
    const proofOfUsId = socket.handshake.auth.proofOfUsId;

    if (!proofOfUsId) {
      return next(new Error('invalid token. not found'));
    }

    next();
  });

  io.on('connection', (socket) => {
    console.log('connection');
    socket.join(socket.handshake.auth.proofOfUsId);

    io.to(socket.handshake.auth.proofOfUsId)
      .to(socket.handshake.auth.proofOfUsId)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(socket.handshake.auth.proofOfUsId),
        from: socket.handshake.auth.proofOfUsId,
      });

    signeeListeners(socket, io);
    avatarListeners(socket, io);
  });

  console.log('Setting up socket');
  res.end();
}
