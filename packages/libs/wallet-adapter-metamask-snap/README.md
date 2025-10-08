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

## Manual Usage: Detection and Connect

If you need lower-level access, the following are also exported:

- **`SnapAdapter`**: The actual adapter class, in case you want to instantiate
  it manually without relying on the lazy-loading factory.
- **`detectSnapProvider`**: A standalone function that checks whether the
  MetaMask provider is present. It returns the provider if found, or `null`
  otherwise. Snap installation/enablement is handled during `connect()`.

```ts
import {
  SnapAdapter,
  detectSnapProvider,
} from '@kadena/wallet-adapter-metamask-snap';

(async () => {
  const provider = await detectSnapProvider({ silent: true });
  if (!provider) {
    console.log('MetaMask not detected.');
    return;
  }
  const adapter = new SnapAdapter({ provider });
  await adapter.connect();
  console.log('Connected to MetaMask Snap directly!');
})();
```

## Detection Behavior

- Detection is non-invasive. It only checks for the injected MetaMask provider
  on `window.ethereum` and does not call `wallet_getSnaps` or other RPCs.
- Any required prompts (unlocking MetaMask, installing/enabling the Kadena
  Snap) occur during `adapter.connect()`.

## Other Notes

- The adapter internally calls `kda_connect`, `kda_requestSign`,
  `kda_disconnect`, etc., using the `"kda_"` RPC prefix required by the Snap.
- If you support multiple wallets in your app, the lazy import in
  `snapAdapterFactory` helps reduce initial bundle size.
- Ensure the user has MetaMask installed. The Kadena Snap will be installed or
  enabled during connect if needed.
