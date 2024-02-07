'use client';

import type Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { pouPeer, socket } from '../../socket';

export interface ISocketContext {
  socket?: Socket;
  peer: () => {
    peer?: Peer;
    conn?: DataConnection;
  };
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
  peer: () => ({}),
  connect: async () => undefined,
  disconnect: () => {},
});

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [proofOfUsId, setProofOfUsId] = useState<string>();

  // const getId = (initiator: boolean, id: string): string => {
  //   return `${id}-${initiator ? 'init' : 'signee'}`;
  // };

  const disconnect = ({ proofOfUsId }: { proofOfUsId: string }) => {
    if ((socket?.auth as any)?.proofOfUsId === proofOfUsId) return;

    pouPeer.disconnect();
    socket?.close();
  };

  const connect = async (data: { proofOfUsId: string; initiator: boolean }) => {
    if (!data.proofOfUsId) return;
    const peer = pouPeer.setup(
      'f6e0854a-ebc9-4e43-b969-3c797a411d17',
      data.initiator,
    );

    peer.on('open', async (id) => {
      console.log('My peer ID is: ' + id);
    });
    //  const conn = await pouPeer.connect();
    // conn.on('close', async () => {
    //   console.log('OPENS IT');
    //   pouPeer.connect();
    // });

    //const { conn } = pouPeer.get();

    // conn.on('open', async () => {
    //   console.log('OPENS IT');
    // });

    // conn.on('data', (data) => {
    //   // Will print 'hi!'
    //   console.log(22, data);
    // });

    // peer.on('error', function (err) {
    //   console.log('error', err);
    // });
    // peer.on('disconnected', function (conn) {
    //   peer.reconnect();
    // });

    // peer.on('connection', function (conn) {
    //   console.log('CONNECTION', conn.open);

    //   conn.on('data', function (data) {
    //     console.log('DATA', data);
    //   });

    //   conn.on('open', () => {
    //     console.log('OPEN');
    //   });
    // });

    // const conn = await pouPeer.connect();
    // // console.log(222, conn);
    // conn.on('open', () => {
    //   console.log(3333311111111);
    //   conn.send('hi!');

    //   conn.on('data', (data) => {
    //     // Will print 'hi!'
    //     console.log(22, data);
    //   });

    //   conn.send('hi');
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
        peer: pouPeer.get,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
