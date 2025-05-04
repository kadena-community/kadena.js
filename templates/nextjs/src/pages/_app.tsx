import type { AdapterFactory } from '@kadena/wallet-adapter-core';
import { eckoAdapter } from '@kadena/wallet-adapter-ecko';
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const adapters: AdapterFactory[] = [eckoAdapter()]; //list the adapters you want to use here
  return (
    <KadenaWalletProvider adapters={adapters}>
      <Component {...pageProps} />;
    </KadenaWalletProvider>
  );
}
