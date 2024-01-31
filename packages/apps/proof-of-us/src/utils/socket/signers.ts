import { store } from '@/utils/socket/store';
import type { Server as IOServer, Socket } from 'socket.io';

export const signeeListeners = (socket: Socket, io: IOServer) => {
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
};
