'use client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { socket } from '../../socket';

export interface ISocketContext {
  socket?: Socket;
  connect: ({ tokenId }: { tokenId: string }) => Promise<Socket | undefined>;
  disconnect: ({ tokenId }: { tokenId: string }) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  connect: async () => undefined,
  disconnect: () => {},
});

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokenId, setTokenId] = useState<string>();

  const disconnect = ({ tokenId }: { tokenId: string }) => {
    if ((socket?.auth as any)?.tokenId === tokenId) return;
    socket?.close();
  };

  const connect = async (data: { tokenId: string }) => {
    if (tokenId && tokenId !== data.tokenId) disconnect(data);
    if (socket.connected) return socket;

    setTokenId(data.tokenId);
    await fetch('/api/socket');
    // eslint-disable-next-line require-atomic-updates
    socket.auth = { tokenId: data.tokenId };
    socket.connect();

    socket.on('connect', () => {
      console.log('connected');
    });

    return socket;
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
