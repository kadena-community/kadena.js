import React, { useMemo } from 'react';
import type { AdapterFactory } from '@kadena/wallet-adapter-core';
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';
import { createChainweaverLegacyAdapter } from '@kadena/wallet-adapter-chainweaver-legacy';
import { createWalletConnectAdapter } from '@kadena/wallet-adapter-walletconnect';
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const adapters: AdapterFactory[] = useMemo(() => [
    createEckoAdapter(),
    createChainweaverLegacyAdapter(),
    createWalletConnectAdapter(),
  ], []);

  return (
    <KadenaWalletProvider adapters={adapters}>
      <Component {...pageProps} />
    </KadenaWalletProvider>
  );
}
