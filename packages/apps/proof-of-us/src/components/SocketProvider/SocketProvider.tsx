'use client';
import type { Socket } from 'dgram';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useState } from 'react';
import io from 'Socket.IO-client';

export interface ISocketContext {
  socket?: Socket;
  connect: (tokenId: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  connect: async () => {},
  disconnect: async () => {},
});

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  const connect = useCallback(async (tokenId: string) => {
    await fetch('/api/socket');
    const sock = io({ autoConnect: false });

    setSocket(sock as unknown as Socket);
    sock.auth = { tokenId };
    sock.connect();

    sock.on('connect', () => {
      sock.send('test');
      console.log('connected');
    });

    sock.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, []);

  const disconnect = useCallback(async () => {
    socket?.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
