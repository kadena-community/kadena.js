'use client';
import { useAccount } from '@/hooks/account';

import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

export interface ISocketContext {
  socket?: Socket;
  connect: ({ tokenId }: { tokenId: string }) => Promise<Socket | undefined>;
  disconnect: ({ tokenId }: { tokenId: string }) => void;
  removeSignee: ({
    tokenId,
    signee,
  }: {
    tokenId: string;
    signee: IProofOfUsSignee;
  }) => Promise<void>;
  addSignee: ({ tokenId }: { tokenId: string }) => Promise<void>;
  createToken: ({ tokenId }: { tokenId: string }) => Promise<void>;
  proofOfUs?: IProofOfUs;
  isConnected: () => boolean;
  isInitiator: () => boolean;
  getSigneeAccount: (account: IAccount) => IProofOfUsSignee;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  connect: async () => undefined,
  disconnect: () => {},
  addSignee: async () => {},
  removeSignee: async () => {},
  createToken: async () => {},
  proofOfUs: undefined,
  isConnected: () => false,
  isInitiator: () => false,
  getSigneeAccount: (account: IAccount): IProofOfUsSignee => ({
    cid: '',
    name: '',
    publicKey: '',
    initiator: false,
  }),
});

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  const [state, setState] = useState<IProofOfUs>();
  const { account } = useAccount();

  const connect = async ({ tokenId }: { tokenId: string }) => {
    if (socket) return socket;

    await fetch('/api/socket');
    const sock = io({ autoConnect: false });

    setSocket(sock);
    sock.auth = { tokenId: tokenId };
    await sock.connect();

    sock.on('connect', () => {
      console.log('connected');
    });

    sock.on('getProofOfUs', ({ content }) => {
      setState(content);
    });

    return sock;
  };

  const disconnect = ({ tokenId }: { tokenId: string }) => {
    if ((socket?.auth as any)?.tokenId === tokenId) return;
    socket?.close();

    setSocket(undefined);
  };

  const addSignee = async ({ tokenId }: { tokenId: string }) => {
    const socket = await connect({ tokenId });
    if (!socket || !account) return;

    socket.emit('addSignee', {
      content: {
        name: account.name,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: tokenId,
    });
  };

  const removeSignee = async ({
    tokenId,
    signee,
  }: {
    tokenId: string;
    signee: IProofOfUsSignee;
  }) => {
    const socket = await connect({ tokenId });
    socket?.emit('removeSignee', {
      content: signee,
      to: tokenId,
    });
  };

  const createToken = async ({ tokenId }: { tokenId: string }) => {
    const socket = await connect({ tokenId });

    if (!socket || !account) return;

    socket?.emit('createToken', {
      content: {
        name: account.name,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: tokenId,
    });
  };

  const isConnected = useCallback(() => {
    return !!state?.signees.find((s) => s.cid === account?.cid);
  }, [state]);

  const isInitiator = useCallback(() => {
    const foundAccount = state?.signees.find((s) => s.cid === account?.cid);
    return !!foundAccount?.initiator;
  }, [state]);

  const getSigneeAccount = (account: IAccount): IProofOfUsSignee => {
    return {
      cid: account.cid,
      name: account.name,
      publicKey: account.publicKey,
      initiator: false,
    };
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connect,
        disconnect,
        addSignee,
        removeSignee,
        proofOfUs: state,
        createToken,
        isConnected,
        isInitiator,
        getSigneeAccount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
