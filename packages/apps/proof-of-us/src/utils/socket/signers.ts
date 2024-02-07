import { store } from '@/utils/socket/store';
import type { Server as IOServer, Socket } from 'socket.io';

export const signeeListeners = (socket: Socket, io: IOServer) => {
  socket.on('updateStatus', ({ content, to }) => {
    store.updateMintStatus(to, content.mintStatus);
    io.to(to).to(to).emit('getProofOfUs', {
      content: undefined,
      from: socket.handshake.auth.proofOfUsId,
    });
  });
  socket.on('closeToken', ({ content, to }) => {
    store.closeToken(to);
    io.to(to).to(to).emit('getProofOfUs', {
      content: undefined,
      from: socket.handshake.auth.proofOfUsId,
    });
  });
  socket.on('createToken', ({ content, to }) => {
    store.createProofOfUs(to, content);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });

  socket.on('updateStatus', ({ content, to }) => {
    store.updateStatus(to, content.status);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });

  socket.on('addSignee', ({ content, to }) => {
    store.addSignee(to, content);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });

  socket.on('updateSigneeStatus', ({ content, to }) => {
    store.updateSignee(to, content);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });

  socket.on('removeSignee', ({ content, to }) => {
    store.removeSignee(to, content);
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });
  socket.on('getProofOfUs', ({ to }) => {
    io.to(to)
      .to(to)
      .emit('getProofOfUs', {
        content: store.getProofOfUs(to),
        from: socket.handshake.auth.proofOfUsId,
      });

    io.to(to)
      .to(to)
      .emit('getProofOfUsBackground', {
        content: store.getBackground(to),
        from: socket.handshake.auth.proofOfUsId,
      });
  });
};
