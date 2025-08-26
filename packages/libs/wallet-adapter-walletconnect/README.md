# WalletConnect Adapter

The **WalletConnect Adapter** package implements a concrete adapter for
WalletConnect, enabling Kadena dApps to connect with wallet providers via
WalletConnect v2. It extends the core’s `BaseWalletAdapter` and provides a
unified interface for establishing sessions, handling QR code pairing, sending
requests, and signing transactions using the standard `kadena_*` methods.

## Features

- **Provider Detection:**  
  Automatically detect WalletConnect support using the built-in provider
  detection mechanism.

- **QR Code Pairing:**  
  When initiating a connection, the adapter opens a QR code modal so users can
  easily pair their wallets.

- **Unified API:**  
  The adapter implements the core’s `request` method by delegating to the
  underlying WalletConnect client's request, ensuring full compatibility with
  Kadena’s standard request methods.

- **Session Persistence:**  
  It subscribes to session events (e.g. session updates and deletes) and
  automatically restores any persisted session.

- **Transaction Signing:**  
  Provides methods for signing transactions and commands in adherence with the
  Kadena signing specifications.

## Installation

```bash
npm install @kadena/wallet-adapter-walletconnect
# or
yarn add @kadena/wallet-adapter-walletconnect
# or
pmpm add @kadena/wallet-adapter-walletconnect
```

## Usage with wallet adapter React

```ts
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';
import { createWalletConnectAdapter } from '@kadena/wallet-adapter-walletconnect';
import ReactDOM from 'react-dom/client';
import App from './App';

const adapters = [
  createWalletConnectAdapter(),
];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <KadenaWalletProvider adapters={adapters}>
    <App />
  </KadenaWalletProvider>
);
```

## Manual Usage of the Adapter or Detection

If you need lower-level access, the following are also exported:

- **`WalletConnectAdapter`**: The actual adapter class, in case you want to
  instantiate it manually without relying on the lazy-loading factory.
- **`detectWalletConnectProvider`**: A standalone function that checks whether
  the WalletConnect is present. It returns the provider if found, or `null`
  otherwise.

```ts
import {
  WalletConnectAdapter,
  detectWalletConnectProvider,
} from '@kadena/wallet-adapter-walletconnect';

(async () => {
  const provider = await detectWalletConnectProvider();
  if (!provider) {
    console.log('WalletConnect not available.');
    return;
  }
  const adapter = new WalletConnectAdapter({ provider });
  await adapter.connect();
  console.log('Connected to WalletConnect directly!');
})();
```

## Supported methods

| Method                | KIP         | Supported | Calls wallet with     |
| --------------------- | ----------- | --------- | --------------------- |
| kadena_sign_v1        | [KIP-17][1] | Yes       | kadena_sign_v1        |
| kadena_quicksign_v1   | [KIP-17][1] | Yes       | kadena_quicksign_v1   |
| kadena_getAccount_v1  | [KIP-37][2] | Yes       | kadena_getAccounts_v1 |
| kadena_getAccounts_v2 | [KIP-38][3] | Yes       | kadena_getAccounts_v1 |
| kadena_getNetwork_v1  | [KIP-39][4] | No        |                       |
| kadena_getNetworks_v1 | [KIP-40][5] | No        |                       |
