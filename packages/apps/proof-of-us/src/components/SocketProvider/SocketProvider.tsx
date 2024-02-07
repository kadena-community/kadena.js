'use client';
import { Peer } from 'peerjs';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { socket } from '../../socket';

export interface ISocketContext {
  socket?: Socket;
  connect: ({
    proofOfUsId,
    initiator,
  }: {
    proofOfUsId: string;
    initiator: boolean;
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

  const connect = async (data: { proofOfUsId: string; initiator: boolean }) => {
    if (!data.proofOfUsId) return;
    const peer = new Peer(data.initiator ? 'pou-1' : 'pou-2', {
      debug: 3,
    });
    console.log({ peer }, peer.id, data.initiator);

    const conn = peer.connect(!data.initiator ? 'pou-1' : 'pou-2');

    setTimeout(() => {}, 1000);

    conn.on('open', () => {
      console.log(33333);
      conn.send('hi!');

      conn.on('data', (data) => {
        // Will print 'hi!'
        console.log(22, data);
      });

      conn.send('hi');
    });

    // conn.send('hi');

    // peer.on('connection', (conn) => {
    //   console.log(222222);
    //   conn.on('data', (data) => {
    //     // Will print 'hi!'
    //     console.log(data);
    //   });
    //   conn.on('open', () => {
    //     conn.send('hello!');
    //   });
    // });

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
