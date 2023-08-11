'use client';

import { type FC, type PropsWithChildren, createContext } from 'react';
import { WalletConnectClient } from './connect.client';

type WalletConnectContext = {
  client: WalletConnectClient;
  projectId: string;
  relayUrl: string;
};

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
