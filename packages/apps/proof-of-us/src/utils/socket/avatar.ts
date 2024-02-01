import { store } from '@/utils/socket/store';
import type { Server as IOServer, Socket } from 'socket.io';

export const avatarListeners = (socket: Socket, io: IOServer) => {
  socket.on('setBackground', ({ content, to }) => {
    store.addBackground(to, content.bg);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.tokenId,
      });
  });
};
