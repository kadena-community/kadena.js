import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_URL ?? '', {
  autoConnect: false,
  path: '/api/socket',
  addTrailingSlash: false,
});
