'use client';
import { useAccount } from '@/hooks/account';
import type { Socket } from 'Socket.IO-client';
import io from 'Socket.IO-client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useState } from 'react';

export interface ISocketContext {
  socket?: Socket;
  connect: ({ tokenId }: { tokenId: string }) => Promise<Socket | undefined>;
  disconnect: ({ tokenId }: { tokenId: string }) => void;
  removeSignee: ({ tokenId }: { tokenId: string }) => Promise<void>;
  addSignee: ({ tokenId }: { tokenId: string }) => Promise<void>;
  createToken: ({ tokenId }: { tokenId: string }) => Promise<void>;
  proofOfUs?: IProofOfUs;
  isConnected: () => boolean;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  connect: async () => undefined,
  disconnect: () => {},
  removeSignee: async () => {},
  addSignee: async () => {},
  createToken: async () => {},
  proofOfUs: undefined,
  isConnected: () => false,
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
    socket?.emit('addSignee', {
      content: {
        name: account?.name,
        key: account?.caccount,
      },
      to: tokenId,
    });
  };

  const removeSignee = async ({ tokenId }: { tokenId: string }) => {
    const socket = await connect({ tokenId });
    socket?.emit('removeSignee', {
      content: {
        name: account?.name,
        key: account?.caccount,
      },
      to: tokenId,
    });
  };

  const createToken = async ({ tokenId }: { tokenId: string }) => {
    const socket = await connect({ tokenId });

    if (!socket || !account) return;

    socket?.emit('createToken', {
      content: {
        name: account.name,
        key: account.caccount,
      },
      to: tokenId,
    });
  };

  const isConnected = useCallback(() => {
    return !!state?.signees.find((s) => s.key === account?.caccount);
  }, [state]);

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
