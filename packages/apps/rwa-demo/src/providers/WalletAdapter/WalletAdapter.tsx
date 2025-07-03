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
        createMagicAdapter({}),
        createChainweaverAdapter({}),
      ]}
    >
      {children}
    </KadenaWalletProvider>
  );
};
