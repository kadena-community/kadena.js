/**
 * To showcase the Kadena Wallet Adapter, this file sets up a React application
 *
 * Adapters provide a `AdapterFactory` that allow for lazy loading of the adapter
 * code. This is done by using `await import("./EckoWalletAdapter")` in the
 * `adapter` method of the factory. This means that the adapter code is only loaded
 *
 * Steps to follow if you add more wallets:
 * - Import the respective adapter (e.g., `import { xWalletAdapter } from "@kadena/wallet-adapter-xwallet";`).
 * - Include it in the array for `adapters`.
 */

import '@kadena/kode-ui/global';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { chainweaverAdapterLegacy } from '@kadena/wallet-adapter-chainweaver-legacy';
import type { AdapterFactory } from '@kadena/wallet-adapter-core';
import { eckoAdapter } from '@kadena/wallet-adapter-ecko';
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// List all adapters you want to use here.
const adapters: AdapterFactory[] = [eckoAdapter(), chainweaverAdapterLegacy()];

// Render the React application, providing the adapters to KadenaWalletProvider.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
    >
      <KadenaWalletProvider adapters={adapters}>
        <App />
      </KadenaWalletProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
