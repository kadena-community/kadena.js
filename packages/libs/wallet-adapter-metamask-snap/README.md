# MetaMask Snaps Wallet Adapter

This package provides an adapter for the **MetaMask Snap for Kadena**. It
extends a base adapter but uses the `"kda_"` RPC prefix defined by the Snap
(matching Ecko Wallet's prefix for compatibility).

## Installation

```bash
npm install @kadena/wallet-adapter-metamask-snap
# or
yarn add @kadena/wallet-adapter-metamask-snap
# or
pnpm add @kadena/wallet-adapter-metamask-snap
```

## Manual Usage of the Adapter or Detection

If you need lower-level access, the following are also exported:

- **`SnapAdapter`**: The actual adapter class, in case you want to instantiate
  it manually without relying on the lazy-loading factory.
- **`detectSnapProvider`**: A standalone function that checks whether the Kadena
  Snap is available in MetaMask. It returns the provider if found, or `null`
  otherwise.

```ts
import {
  SnapAdapter,
  detectSnapProvider,
} from '@kadena/wallet-adapter-metamask-snap';

(async () => {
  const provider = await detectSnapProvider({ silent: true });
  if (!provider) {
    console.log('MetaMask Snap not available.');
    return;
  }
  const adapter = new SnapAdapter({ provider });
  await adapter.connect();
  console.log('Connected to MetaMask Snap directly!');
})();
```

## Other Notes

- The adapter internally calls `kda_connect`, `kda_requestSign`,
  `kda_disconnect`, etc., using the `"kda_"` RPC prefix required by the Snap.
- If you support multiple wallets in your app, the lazy import in `snapAdapter`
  helps reduce initial bundle size, loading only when MetaMask with the Snap is
  detected.
- Ensure the user has MetaMask installed **and** the Kadena Snap enabled.
  Detection will return `null` otherwise.
