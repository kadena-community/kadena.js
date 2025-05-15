# Ecko Wallet Adapter

This package provides an adapter for the Ecko Wallet extension on Kadena. It
extends a base adapter but uses the `"kda_"` RPC prefix (required by Ecko)
rather than the standard `"kadena_"` prefix.

## Installation

```bash
npm install @kadena/wallet-adapter-ecko
# or
yarn add @kadena/wallet-adapter-ecko
# or
pmpm add @kadena/wallet-adapter-ecko
```

## Manual Usage of the Adapter or Detection

If you need lower-level access, the following are also exported:

- **`EckoAdapter`**: The actual adapter class, in case you want to instantiate
  it manually without relying on the lazy-loading factory.
- **`detectEckoProvider`**: A standalone function that checks whether the Ecko
  wallet is present. It returns the provider if found, or `null` otherwise.

```ts
import { EckoAdapter, detectEckoProvider } from '@kadena/wallet-adapter-ecko';

(async () => {
  const provider = await detectEckoProvider({ silent: true });
  if (!provider) {
    console.log('Ecko not available.');
    return;
  }
  const adapter = new EckoWalletAdapter({ provider });
  await adapter.connect();
  console.log('Connected to Ecko directly!');
})();
```

## Other Notes

- The adapter internally calls `kda_connect`, `kda_requestSign`,
  `kda_disconnect`, and similar Ecko-specific RPC methods (all `"kda_"`
  prefixed).
- If you support multiple wallets in your app, the lazy import in `eckoAdapter`
  can help reduce your initial bundle size, because the Ecko adapter code is
  only loaded if the provider is actually detected.
- Make sure the user has installed the Ecko Wallet extension. Otherwise,
  detection will yield `null`.
