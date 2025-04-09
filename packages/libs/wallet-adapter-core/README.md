# Kadena Wallet Adapter Core

# Wallet Adapter Core

**wallet-adapter-core** is the foundation for integrating wallet providers into
your Kadena dApps. It implements standardized JSON-RPC methods from KIP 15, 17
and 37 through KIP 41 while also extending functionality with convenient helper
methods that are not part of the JSON-RPC 2.0 spec. The package provides a
robust, framework-agnostic foundation for integrating multiple Kadena wallet
adapters into your applications. It standardizes wallet communication by
defining a common `Provider` interface, a reusable abstract base class, and a
client for managing multiple adapters.

## What It Implements

- **KIP 37–41 (Account & Network Management):**

  - **kadena_getAccount_v1:** Retrieve the active account.
  - **kadena_getAccounts_v2:** Retrieve all managed accounts.
  - **kadena_getNetwork_v1:** Get the currently active network.
  - **kadena_getNetworks_v1:** Get all supported networks.
  - **kadena_changeNetwork_v1:** Change the active network.

- **Extended Methods (Not in JSON-RPC 2.0):**

  - **kadena_connect / kadena_disconnect:** These methods provide a consistent
    way to start or end a wallet session. (They are not defined in JSON-RPC
    2.0.)
  - **onAccountChange / onNetworkChange:**  
    These allow your app to subscribe to changes in the wallet’s state.

- **KIP 15 & KIP 17 (Transaction Signing):**
  - **kadena_quicksign_v1 (alias: signCommand):**  
    Supports signing multiple transactions (or commands) at once.
  - **kadena_sign_v1 (alias: signTransaction):**  
     Supports signing a single transaction.  
    These enable flexible and efficient signing workflows.

## JSON-RPC Error Codes

When interacting with wallet adapters, the following error codes might be
returned:

| Code   | Message                                 |
| ------ | --------------------------------------- |
| -32001 | Resource not found                      |
| -32002 | Resource unavailable                    |
| -32003 | Transaction rejected                    |
| -32004 | The requested method is not implemented |
| -32005 | Could not return account information    |
| -32006 | Requested network does not exist        |
| -32601 | Method not found                        |
| -32602 | Invalid method parameter(s)             |
| -32603 | Internal server error                   |

## Why It Matters

- **Unified Interface:**  
  By mapping various wallet-specific APIs to a standard set of
  `"kadena_"`‑prefixed methods, Wallet Adapter Core ensures your dApp works
  seamlessly with multiple wallet providers.

- **Enhanced Developer Experience:**  
  Extended methods like `connect`, `disconnect`, and event subscriptions
  abstract provider-specific details so you can focus on building your
  application.

- **Flexible Signing Workflows:**  
  With separate commands for signing and quicksigning, your dApp can handle a
  variety of use cases independently.

## Usage Examples

### Connecting to a Wallet

```ts
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import { EckoWalletAdapter } from 'wallet-adapter-ecko';

// Create an instance of your wallet adapter
const eckoAdapter = new EckoWalletAdapter();

// Create a client managing one or more wallet adapters
const client = new WalletAdapterClient([eckoAdapter]);

// Connect to the wallet using the standardized 'connect' method.
client.connect('Ecko').then((account) => {
  console.log('Connected account:', account.accountName);
});
```

### Signing a Transaction

Use the `signTransaction` method (alias for kadena_sign_v1) to sign a single
transaction:

```ts
// Assuming transactionData is defined as per the signing API
client.signTransaction('Ecko', transactionData).then((signedCommand) => {
  console.log('Signed transaction:', signedCommand);
});
```

### Signing Commands (QuickSign)

The `signCommand` method (alias for kadena_quicksign_v1) lets you sign multiple
commands independently:

```ts
// Assume commandData is defined as per the quicksign request schema.
client.signCommand('Ecko', commandData).then((signedCommand) => {
  console.log('Signed command:', signedCommand);
});
```

### Disconnecting from the Wallet

Disconnect from the wallet using the standardized `disconnect` method:

```ts
client.disconnect('Ecko').then(() => {
  console.log('Wallet disconnected');
});
```

### Listening for State Changes

Subscribe to account or network changes to react to state updates:

```ts
eckoAdapter.onAccountChange((newAccount) => {
  console.log('Account changed:', newAccount.accountName);
});

eckoAdapter.onNetworkChange((newNetwork) => {
  console.log('Network changed to:', newNetwork.name);
});
```

## Framework Wrappers

While **wallet-adapter-core** can be used directly (ideal for vanilla
JavaScript/TypeScript projects), dedicated wrappers are available for popular
frameworks:

- **wallet-adapter-react** – For React applications.
- **wallet-adapter-vue** – For Vue.js applications. // WIP
- **wallet-adapter-angular** – For Angular projects. // WIP

These wrappers simplify integration with their respective ecosystems.

--

## Conclusion

Wallet Adapter Core forms the backbone of wallet integration in the Kadena
ecosystem. By combining standardized methods from KIP 37–41 with extended
functionalities (such as connect/disconnect and event subscriptions) and
flexible signing workflows (via KIP 15 and KIP 17), it offers a robust,
developer-friendly framework for managing wallet interactions. Whether you build
your application using vanilla JavaScript or with one of the available framework
wrappers, Wallet Adapter Core ensures a consistent, reliable interface for
integrating multiple wallet providers.

---

# Kadena Wallet Adapter Development Guide

This comprehensive guide is designed for wallet developers looking to create a
Kadena wallet adapter that conforms to the Kadena Improvement Proposals (KIPs),
specifically KIP-15, KIP-17, and KIP-37 through KIP-41. These KIPs define a
standardized JSON-RPC interface for wallet and decentralized application (dApp)
communication within the Kadena ecosystem. By following this guide, you’ll learn
how to build an adapter using the `@kadena/wallet-adapter-core` package,
implement the required functionality, and integrate it into dApps.

## Introduction

The Kadena wallet adapter framework provides a standardized way to integrate
wallets into Kadena-based dApps. The `@kadena/wallet-adapter-core` package
offers a foundation with the `BaseWalletAdapter` class, which you can extend to
create a custom adapter for your wallet. This guide walks you through the
process step-by-step, ensuring your adapter supports essential features like
account management, network handling, and transaction signing while adhering to
Kadena’s KIP specifications.

### Prerequisites

- **Knowledge**: Familiarity with TypeScript, JSON-RPC, and Kadena’s blockchain
  concepts (e.g., Pact, Chainweb).
- **Tools**: Node.js, npm or yarn, and a code editor.
- **Dependencies**: Install `@kadena/wallet-adapter-core` and `@kadena/client`.

```bash
npm install @kadena/wallet-adapter-core @kadena/client
```

---

## Step-by-Step Guide to Creating a Wallet Adapter

### Step 1: Set Up Your Project

1. **Initialize a New Project**  
   Create a new directory for your wallet adapter and initialize it with npm:

   ```bash
   mkdir wallet-adapter-my-wallet
   cd wallet-adapter-my-wallet
   npm init -y
   ```

2. **Install Dependencies**  
   Add the core dependencies and development tools:

   ```bash
   npm install @kadena/wallet-adapter-core
   npm install --save-dev typescript vitest
   ```

3. **Configure TypeScript**  
   Create `tsconfig.json` for ES modules and CommonJS builds:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "lib": ["DOM", "ES2020"],
       "moduleResolution": "Node",
       "esModuleInterop": true,
       "strict": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "outDir": "dist",
       "sourceMap": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

   Create `tsconfig.esm.json` and `tsconfig.cjs.json` for dual builds:

   - `tsconfig.esm.json`:

     ```json
     {
       "extends": "./tsconfig.json",
       "compilerOptions": {
         "module": "ESNext",
         "outDir": "dist/esm",
         "declaration": true,
         "declarationDir": "dist/esm"
       }
     }
     ```

   - `tsconfig.cjs.json`:
     ```json
     {
       "extends": "./tsconfig.json",
       "compilerOptions": {
         "module": "CommonJS",
         "outDir": "dist/cjs",
         "declaration": false
       }
     }
     ```

4. **Update `package.json`**  
   Define your package metadata and scripts:

   ```json
   {
     "name": "@kadena/wallet-adapter-my-wallet",
     "version": "1.0.0",
     "main": "dist/cjs/index.js",
     "module": "dist/esm/index.js",
     "types": "dist/esm/index.d.ts",
     "exports": {
       "import": "./dist/esm/index.js",
       "require": "./dist/cjs/index.js"
     },
     "scripts": {
       "build": "tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json",
       "test": "vitest"
     },
     "dependencies": {
       "@kadena/wallet-adapter-core": "^0.42.1"
     },
     "devDependencies": {
       "typescript": "5.4.5",
       "vitest": "^1.6.0"
     }
   }
   ```

5. **Create Source Directory**  
   Set up your source files:

   ```bash
   mkdir src
   touch src/index.ts src/MyWalletAdapter.ts src/provider.ts
   ```

---

### Step 2: Define the Provider Interface

Your wallet likely injects a provider object into the browser’s `window` object
(e.g., `window.kadena`). Define an interface that extends the core `Provider`
type to match your wallet’s API.

1. **Create `provider.ts`**  
   Define the provider interface and detection logic:

   ```typescript
   import { Provider } from '@kadena/wallet-adapter-core';

   // Extend the base Provider interface with your wallet-specific properties
   export interface MyWalletProvider extends Provider {
     isMyWallet?: boolean; // Optional flag to identify your wallet
   }

   // Extend the Window interface to include your provider
   interface KadenaWindow extends Window {
     kadena?: MyWalletProvider;
   }

   // Detect the provider in the browser
   export async function detectMyWalletProvider<
     T = DemoProvider,
   >(): Promise<T | null> {
     if (typeof window !== 'undefined') {
       const kadenaProvider = (window as KadenaWindow).kadena;
       if (kadenaProvider) {
         return kadenaProvider as T;
       }
     }
     return null;
   }
   ```

   - **Purpose**: This code checks if your wallet provider is available in the
     browser and returns it if found.
   - **KIP Compliance**: Ensures compatibility with browser-based wallet
     detection, a common practice in blockchain ecosystems.

---

### Step 3: Implement the Wallet Adapter

Extend the `BaseWalletAdapter` class to implement your wallet’s functionality.
This involves overriding methods to match your wallet’s API while adhering to
KIP standards.

1. **Create `MyWalletAdapter.ts`**  
   Implement the adapter:

   ```typescript
   import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
   import type {
     AccountInfo,
     NetworkInfo,
     IUnsignedCommand,
     ICommand,
   } from '@kadena/wallet-adapter-core';
   import { detectMyWalletProvider, MyWalletProvider } from './provider';

   export class MyWalletAdapter extends BaseWalletAdapter {
     public name = 'MyWallet'; // Display name of your wallet

     constructor(provider?: MyWalletProvider, networkId?: string) {
       super(provider, networkId || 'mainnet01');
     }

     // Detect the wallet provider
     async detect(): Promise<boolean> {
       const provider = await detectMyWalletProvider();
       if (provider) {
         this.provider = provider;
       }
       return !!provider;
     }

     async connect(silent: boolean = false): Promise<AccountInfo | null> {
       // your connect method
     }

     // Handle disconnection
     async disconnect(): Promise<void> {
       // your disconnect method
     }
   }
   ```

   - **Key Methods**: (available in base-wallet-adapter)
     - `detect()`: Checks for your wallet’s presence.
     - `connect()`: Establishes a session (supports silent mode).
     - `getActiveAccount()`: Returns the active account per KIP-37.
     - `getAccounts()`: Returns all managed accounts per KIP-38.
     - `getActiveNetwork()`: Returns the current network per KIP-39.
     - `getNetworks()`: Lists all supported networks per KIP-40.
     - `signTransaction()`: Signs a single transaction per KIP-17.
     - `signCommand()`: Signs multiple commands per KIP-15.
     - `changeNetwork()`: Switches the network per KIP-41.

2. **Export in `index.ts`**  
   Make your adapter available:

   ```typescript
   export { MyWalletAdapter } from './MyWalletAdapter';
   export { detectMyWalletProvider } from './provider';
   ```

### Step 4: Test Your Adapter

1. **Set Up Vitest**  
   Create a `vitest.config.ts`:

   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       globals: true,
       environment: 'node',
       include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
     },
   });
   ```

2. **Write Tests**  
   Create `src/__tests__/MyWalletAdapter.test.ts`:

   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { MyWalletAdapter } from '../MyWalletAdapter';

   describe('MyWalletAdapter', () => {
     it('detects the provider', async () => {
       const adapter = new MyWalletAdapter();
       const mockProvider = { request: vi.fn() };
       vi.stubGlobal('kadena', mockProvider);
       const detected = await adapter.detect();
       expect(detected).toBe(true);
       expect(adapter.isDetected()).toBe(true);
     });

     it('connects successfully', async () => {
       const adapter = new MyWalletAdapter({
         request: vi.fn().mockResolvedValue({ accountName: 'test' }),
       });
       const account = await adapter.connect();
       expect(account).toHaveProperty('accountName', 'test');
     });
   });
   ```

3. **Run Tests**  
   Execute your tests:

   ```bash
   npm run test
   ```

---

### Step 6: Build and Publish

1. **Build the Project**  
   Compile your TypeScript code:

   ```bash
   npm run build
   ```

2. **Publish to npm**  
   If you’re sharing your adapter:

   ```bash
   npm publish --access public
   ```

---

## Using Your Adapter

### In a Vanilla JavaScript/TypeScript Project

1. **Instantiate the Adapter**

   ```typescript
   import { MyWalletAdapter } from '@kadena/wallet-adapter-my-wallet';
   import { WalletAdapterClient } from '@kadena/wallet-adapter-core';

   const adapter = new MyWalletAdapter();
   const client = new WalletAdapterClient([adapter]);

   client.connect('MyWallet').then((account) => {
     console.log('Connected:', account.accountName);
   });
   ```

2. **Sign a Transaction**
   ```typescript
   const transaction: IUnsignedCommand = { cmd: '...', sigs: [] };
   client.signTransaction('MyWallet', transaction).then((signed) => {
     console.log('Signed:', signed);
   });
   ```

### In a React Application

1. **Set Up with `KadenaWalletProvider`**

   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';
   import { MyWalletAdapter } from '@kadena/wallet-adapter-my-wallet';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <KadenaWalletProvider adapters={[new MyWalletAdapter()]}>
       <App />
     </KadenaWalletProvider>,
   );
   ```

2. **Use the Hook**

   ```tsx
   import { useKadenaWallet } from '@kadena/wallet-adapter-react';

   const App = () => {
     const { client, adapters } = useKadenaWallet();

     const handleConnect = async () => {
       const account = await client.connect('MyWallet');
       console.log('Connected:', account);
     };

     return (
       <div>
         <h1>My Kadena dApp</h1>
         <button onClick={handleConnect}>Connect MyWallet</button>
       </div>
     );
   };

   export default App;
   ```

---

## Best Practices

- **Error Handling**: Return JSON-RPC 2.0-compliant errors (e.g., `-32603` for
  internal errors).
- **Security**: Never expose private keys; use `OptionalKeyPair` to omit
  `secretKey`.
- **Optional Event Handling**: Implement `onAccountChange` and `onNetworkChange`
  for real-time updates.

---

## Happy coding

Use the `@kadena/wallet-adapter-core` tools to streamline development, making it
fully compatible with Kadena dApps, and test thoroughly to ensure reliability.
Happy coding!
