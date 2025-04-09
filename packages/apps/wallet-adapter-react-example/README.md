# Kadena React Example

This example demonstrates how to integrate multiple Kadena wallet adapters (e.g. **Ecko** and **Zelcore**) into a React application using the **@kadena/wallet-adapter-react** package. The adapters themselves come from **@kadena/wallet-adapter-ecko** and **@kadena/wallet-adapter-zelcore**, respectively.

## Overview

- **@kadena/wallet-adapter-core**  
  Defines the standardized `Provider` interface, the `BaseWalletAdapter` abstract class (which enforces `"kadena_*"` method naming), and the `WalletAdapterClient` for managing multiple adapters.

- **@kadena/wallet-adapter-react**  
  Supplies a React context (`KadenaWalletProvider`) that instantiates a `WalletAdapterClient` from an array of adapters and tracks one “current adapter” by name. You can access this via the `useKadenaWallet` hook to connect, disconnect, sign transactions, etc.

## Setup

1. **Navigate to the example directory:**

   ```bash
   cd examples/react-example
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

## Usage

In this example, your React app retrieves the `WalletAdapterClient` and the “current adapter” via the `useKadenaWallet()` hook. You then call the client’s methods directly to connect, disconnect, or sign transactions.

### Quick Setup

1. **Wrap Your App** with `KadenaWalletProvider` in your root file (e.g. `main.tsx`):

   ```tsx
   import ReactDOM from "react-dom/client";
   import App from "./App";
   import { KadenaWalletProvider } from "@kadena/wallet-adapter-react";
   import { EckoWalletAdapter } from "@kadena/wallet-adapter-ecko";
   import { ZelcoreWalletAdapter } from "@kadena/wallet-adapter-zelcore";

   ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
     <React.StrictMode>
       <KadenaWalletProvider
         adapters={[
           new EckoWalletAdapter(),
           new ZelcoreWalletAdapter(),
         ]}
       >
         <App />
       </KadenaWalletProvider>
     </React.StrictMode>
   );
   ```

2. **Use the `useKadenaWallet` Hook** in your components:

   ```tsx
   import React, { useState } from "react";
   import { useKadenaWallet } from "@kadena/wallet-adapter-react";

   const App = () => {
     const { client } = useKadenaWallet();
     const [selectedWallet, setSelectedWallet] = useState("Ecko");

     const handleConnect = async () => {
       await client.connect(selectedWallet.name);
       // You can now retrieve account info, network, etc.
     };

     return (
       <div>
         <h1>My Kadena dApp</h1>
         <p>Current Adapter: {selectedWallet.name || "None"}</p>
         <button onClick={handleConnect}>Connect {selectedWallet.name}</button>
       </div>
     );
   };

   export default App;
   ```

With this approach, you can easily manage multiple wallets, connect/disconnect, sign transactions, and update UI state based on the currently selected Kadena wallet.