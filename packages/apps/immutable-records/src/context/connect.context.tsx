'use client';
import { WalletConnectClient } from '@/services/connect/connect.client';
import type { FC, PropsWithChildren } from 'react';
import { createContext } from 'react';

interface WalletConnectContext {
  client: WalletConnectClient;
  projectId: string;
  relayUrl: string;
}

const client = new WalletConnectClient();

export const WalletConnectContext = createContext<WalletConnectContext>({
  client,
  projectId: '',
  relayUrl: '',
});

export const WalletConnectProvider: FC<
  PropsWithChildren<{ projectId: string; relayUrl: string }>
> = ({ children, projectId, relayUrl }) => {
  return (
    <WalletConnectContext.Provider value={{ client, projectId, relayUrl }}>
      {children}
    </WalletConnectContext.Provider>
  );
};
