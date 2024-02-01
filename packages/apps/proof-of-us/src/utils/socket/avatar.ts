import { store } from '@/utils/socket/store';
import { Akord, Auth } from '@akord/akord-js';
import type { Server as IOServer, Socket } from 'socket.io';

import { upload } from './upload';

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

  socket.on('uploadBackground', async ({ content, to }) => {
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
          from: socket.handshake.auth.tokenId,
        });
      return;
    }

    const { wallet } = await Auth.signIn(AKORD_EMAIL, AKORD_PASSWORD);
    const akord = new Akord(wallet, {
      debug: true,
    });

    if (!content.bg) return;

    const proofOfUs = store.getProofOfUs(to);
    const result = await upload(akord, content.bg, to, proofOfUs);

    io.to(to).to(to).emit('uploadBackgroundStatus', {
      content: result,
      from: socket.handshake.auth.tokenId,
    });
  });
};
