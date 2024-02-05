'use client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { socket } from '../../socket';

export interface ISocketContext {
  socket?: Socket;
  connect: ({
    proofOfUsId,
  }: {
    proofOfUsId: string;
  }) => Promise<Socket | undefined>;
  disconnect: ({ proofOfUsId }: { proofOfUsId: string }) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  connect: async () => undefined,
  disconnect: () => {},
});

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [proofOfUsId, setProofOfUsId] = useState<string>();

  const disconnect = ({ proofOfUsId }: { proofOfUsId: string }) => {
    if ((socket?.auth as any)?.proofOfUsId === proofOfUsId) return;
    socket?.close();
  };

  const connect = async (data: { proofOfUsId: string }) => {
    if (proofOfUsId && proofOfUsId !== data.proofOfUsId) disconnect(data);
    if (socket.connected) return socket;

    setProofOfUsId(data.proofOfUsId);
    await fetch('/api/socket');
    // eslint-disable-next-line require-atomic-updates
    socket.auth = { proofOfUsId: data.proofOfUsId };
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
