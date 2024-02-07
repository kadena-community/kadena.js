import { io } from 'socket.io-client';

export const socket = io(
  'https://proof-of-us-git-feat-poucheckforsigners-kadena-js.vercel.app/',
  {
    autoConnect: false,
    path: '/api/socket_io',
    addTrailingSlash: false,
  },
);
