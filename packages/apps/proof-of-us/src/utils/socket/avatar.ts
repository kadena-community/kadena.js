import { store } from '@/utils/socket/store';
import { Akord, Auth } from '@akord/akord-js';
import type { Server as IOServer, Socket } from 'socket.io';
import { upload } from './upload';

export const avatarListeners = (socket: Socket, io: IOServer) => {
  socket.on('setBackground', ({ content, to }) => {
    console.log('added');
    store.addBackground(to, content.bg);
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

  socket.on('uploadBackground', async ({ to }) => {
    const AKORD_EMAIL = process.env.AKORD_EMAIL;
    const AKORD_PASSWORD = process.env.AKORD_PASSWORD;
    if (!AKORD_EMAIL || !AKORD_PASSWORD) {
      io.to(to)
        .to(to)
        .emit('uploadBackgroundStatus', {
          content: {
            status: 500,
            message: 'missing auth',
          },
          from: socket.handshake.auth.proofOfUsId,
        });
      return;
    }

    const { wallet } = await Auth.signIn(AKORD_EMAIL, AKORD_PASSWORD);
    const bg = store.getBackground(to);
    const akord = new Akord(wallet, {
      debug: true,
    });

    if (!bg) return;

    const proofOfUs = store.getProofOfUs(to);
    if (!proofOfUs) {
      io.to(to)
        .to(to)
        .emit('uploadBackgroundStatus', {
          content: {
            status: 500,
            message: 'id not found',
          },
          from: socket.handshake.auth.proofOfUsId,
        });
      return;
    }

    const result = await upload(akord, bg, to, proofOfUs);

    io.to(to).to(to).emit('uploadBackgroundStatus', {
      content: result,
      from: socket.handshake.auth.proofOfUsId,
    });
  });
};
