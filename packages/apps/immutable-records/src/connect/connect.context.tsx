'use client';

import {
  type FC,
  type PropsWithChildren,
  createContext,
  useState,
} from 'react';
import { WalletConnectClient } from './connect.client';

type WalletConnectContext = {
  client: WalletConnectClient | null;
  setClient: (client: WalletConnectClient) => void;
  projectId: string;
  relayUrl: string;
};

export const WalletConnectContext = createContext<WalletConnectContext>({
  client: null,
  setClient: () => {},
  projectId: '',
  relayUrl: '',
});

export const WalletConnectProvider: FC<
  PropsWithChildren<{ projectId: string; relayUrl: string }>
> = ({ children, projectId, relayUrl }) => {
  const [client, setClient] = useState<WalletConnectClient | null>(null);
  return (
    <WalletConnectContext.Provider
      value={{ client, setClient, projectId, relayUrl }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
