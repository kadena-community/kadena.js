# WalletConnect Adapter

The **WalletConnect Adapter** package implements a concrete adapter for WalletConnect, enabling Kadena dApps to connect with wallet providers via WalletConnect v2. It extends the core’s `BaseWalletAdapter` and provides a unified interface for establishing sessions, handling QR code pairing, sending requests, and signing transactions using the standard `kadena_*` methods.

## Features

- **Provider Detection:**  
  Automatically detect WalletConnect support using the built-in provider detection mechanism.

- **QR Code Pairing:**  
  When initiating a connection, the adapter opens a QR code modal so users can easily pair their wallets.

- **Unified API:**  
  The adapter implements the core’s `request` method by delegating to the underlying WalletConnect client's request, ensuring full compatibility with Kadena’s standard request methods.

- **Session Persistence:**  
  It subscribes to session events (e.g. session updates and deletes) and automatically restores any persisted session.

- **Transaction Signing:**  
  Provides methods for signing transactions and commands in adherence with the Kadena signing specifications.

## Installation

```bash
npm install wallet-adapter-wc
# or
yarn add wallet-adapter-wc
