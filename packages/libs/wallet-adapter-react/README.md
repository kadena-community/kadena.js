# React Wallet Adapter

The **React Wallet Adapter** package provides a simple React context that wraps a `WalletAdapterClient` (from wallet-adapter-core). It lets you supply an array of wallet adapters (each implementing the standardized `Provider` interface) and tracks a single “current adapter” by name. You can then use the client’s API directly in your components to connect, disconnect, sign transactions, and more.

## Installation

```bash
npm install react-wallet-adapter
# or
yarn add react-wallet-adapter
```

## WalletAdapterClient Functions

The `WalletAdapterClient` offers a rich set of methods to manage wallet interactions. Below is a list of available functions with brief descriptions:

- **`init()`**: Initializes all adapters by calling their `isDetected` method to check availability.
- **`getAdapters()`**: Returns an array of all registered adapters.
- **`getActiveAdapters()`**: Returns an array of adapters that are currently detected.
- **`getAdapter(adapterName: string)`**: Retrieves a specific adapter by its name (case-insensitive).
- **`onAdapterDetected(cb: (adapter: Adapter) => void, options?: { signal?: AbortSignal })`**: Subscribes to events triggered when an adapter is detected.
- **`request(adapterName: string, args: { method: string; [key: string]: any })`**: Sends a generic request to an adapter’s underlying provider.
- **`connect(adapterName: string, silent?: boolean)`**: Connects to a wallet, optionally in silent mode (returns `AccountInfo` or `null` if silent).
- **`disconnect(adapterName: string)`**: Disconnects from a wallet.
- **`getActiveAccount(adapterName: string)`**: Retrieves the currently active account.
- **`getAccounts(adapterName: string)`**: Retrieves all accounts (returns an array, even if only one account is supported).
- **`getActiveNetwork(adapterName: string)`**: Retrieves the current network.
- **`getNetworks(adapterName: string)`**: Retrieves all available networks (returns an array, even if only one network is supported).
- **`signTransaction(adapterName: string, transaction: IUnsignedCommand)`**: Signs a transaction and returns a signed `ICommand`.
- **`signCommand(adapterName: string, command: IUnsignedCommand)`**: Signs a command and returns a signed `ICommand`.
- **`onAccountChange(adapterName: string, cb: (newAccount: AccountInfo) => void)`**: Subscribes to account change events.
- **`onNetworkChange(adapterName: string, cb: (newNetwork: NetworkInfo) => void)`**: Subscribes to network change events.
- **`changeNetwork(adapterName: string, network: NetworkInfo)`**: Changes the wallet’s network and returns `{ success: boolean; reason?: string }`.

These methods provide comprehensive control over wallet interactions, making it easy to integrate Kadena wallets into your application.

## Usage

In this example, your React app uses the `useKadenaWallet` hook to retrieve the `WalletAdapterClient` and the “current adapter.” You can then call the client’s methods to connect, disconnect, sign transactions, retrieve account and network information, and subscribe to events.

### Quick Setup

1. **Wrap Your App** with `KadenaWalletProvider` in your root file (e.g., `main.tsx`):

   ```tsx
    import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";
    import { KadenaWalletProvider } from "@kadena/wallet-adapter-react";
    import { eckoAdapter } from "@kadena/wallet-adapter-ecko";
    import type { Adapter } from "@kadena/wallet-adapter-core";
    import "@kadena/kode-ui/global";

    (async () => {
      // Attempt to detect Ecko Wallet (or multiple wallets if desired).
      const adapters = (await Promise.all([eckoAdapter()])).filter(Boolean) as Adapter[];

      // Render the React application, providing the detected adapters to KadenaWalletProvider.
      ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
          <KadenaWalletProvider adapters={adapters}>
            <App />
          </KadenaWalletProvider>
        </React.StrictMode>,
      );
    })();
   ```

2. **Use the `useKadenaWallet` Hook** in your components:

   ```tsx
   import React, { useState, useEffect } from "react";
   import { useKadenaWallet } from "@kadena/wallet-adapter-react";

   const App = () => {
     const { client, currentAdapter } = useKadenaWallet();
     const [selectedWallet, setSelectedWallet] = useState("Ecko");
     const [account, setAccount] = useState(null);
     const [network, setNetwork] = useState(null);

     // Handle wallet connection
     const handleConnect = async () => {
       if (currentAdapter) {
         const accountInfo = await client.connect(currentAdapter.name);
         setAccount(accountInfo);
         console.log("Connected account:", accountInfo);
       }
     };

     // Sign a transaction
     const handleSignTransaction = async () => {
       if (currentAdapter) {
         const transaction = { /* Your IUnsignedCommand object */ };
         const signedTx = await client.signTransaction(currentAdapter.name, transaction);
         console.log("Signed transaction:", signedTx);
       }
     };

     // Subscribe to account changes
     useEffect(() => {
       if (currentAdapter) {
         client.onAccountChange(currentAdapter.name, (newAccount) => {
           setAccount(newAccount);
           console.log("Account changed:", newAccount);
         });
       }
     }, [currentAdapter, client]);

     // Subscribe to network changes
     useEffect(() => {
       if (currentAdapter) {
         client.onNetworkChange(currentAdapter.name, (newNetwork) => {
           setNetwork(newNetwork);
           console.log("Network changed:", newNetwork);
         });
       }
     }, [currentAdapter, client]);

     return (
       <div>
         <h1>My Kadena dApp</h1>
         <p>Current Adapter: {currentAdapter?.name || "None"}</p>
         <p>Connected Account: {account ? account.account : "Not connected"}</p>
         <p>Current Network: {network ? network.networkId : "Unknown"}</p>
         <button onClick={handleConnect}>Connect {selectedWallet}</button>
         <button onClick={handleSignTransaction}>Sign Transaction</button>
       </div>
     );
   };

   export default App;
   ```

### Advanced Hook Usage

The `useKadenaWallet` hook provides access to the full power of the `WalletAdapterClient`. Here are additional examples of how to use it:

- **List All Adapters:**
  ```tsx
  const { client } = useKadenaWallet();
  const adapters = client.getAdapters();
  console.log("All adapters:", adapters.map(adapter => adapter.name));
  ```

- **Filter Active Adapters:**
  ```tsx
  const activeAdapters = client.getActiveAdapters();
  console.log("Active adapters:", activeAdapters.map(adapter => adapter.name));
  ```

- **Detect Adapters Dynamically:**
  ```tsx
  useEffect(() => {
    client.onAdapterDetected((adapter) => {
      console.log("Adapter detected:", adapter.name);
    });
  }, [client]);
  ```

- **Retrieve All Accounts:**
  ```tsx
  const fetchAccounts = async () => {
    if (currentAdapter) {
      const accounts = await client.getAccounts(currentAdapter.name);
      console.log("All accounts:", accounts);
    }
  };
  ```

** Not supported by all wallets **
- **Change the Network:**
  ```tsx
  const switchNetwork = async () => {
    if (currentAdapter) {
      const newNetwork = { networkId: "testnet04", /* other network details */ };
      const result = await client.changeNetwork(currentAdapter.name, newNetwork);
      if (result.success) {
        console.log("Network switched successfully");
      } else {
        console.error("Network switch failed:", result.reason);
      }
    }
  };
  ```

These examples demonstrate how to leverage the `WalletAdapterClient`’s capabilities through the `useKadenaWallet` hook, enabling you to build dynamic and responsive wallet integrations.
