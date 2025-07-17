import { createChainweaverAdapter } from '@kadena/wallet-adapter-chainweaver';
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';
import { createMagicAdapter } from '@kadena/wallet-adapter-magic';
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';
import type { PropsWithChildren } from 'react';

export const WalletAdapterProvider = ({ children }: PropsWithChildren) => {
  return (
    <KadenaWalletProvider
      adapters={[
        createEckoAdapter(),
        createMagicAdapter({
          magicApiKey: process.env.NEXT_PUBLIC_MAGIC_APIKEY,
          chainwebApiUrl: process.env.NEXT_PUBLIC_CHAINWEBAPIURL,
          chainId: process.env.NEXT_PUBLIC_CHAINID,
          networkId: process.env.NEXT_PUBLIC_NETWORKID,
        }),
        createChainweaverAdapter({
          appName: 'RWA Demo',
        }),
      ]}
    >
      {children}
    </KadenaWalletProvider>
  );
};
