# Wallet adapter Chainweaver V3

This package provides an adapter for the Chainweaver Legacy Wallet on Kadena. It
extends a base adapter while preserving the `"kadena_"`‑prefixed methods
expected by `BaseWalletAdapter` by mapping them to the Chainweaver local HTTP
API.

## Installation

```bash
npm install @kadena/wallet-adapter-chainweaver-legacy
# or
yarn add @kadena/wallet-adapter-chainweaver-legacy
# or
pmpm add @kadena/wallet-adapter-chainweaver-legacy
```

## Factory Usage

The primary export is a factory function `chainweaverAdapterLegacy`, which
detects the Chainweaver provider and, if found, returns an adapter instance. If
the Chainweaver provider is not available, detection returns `null`:

```ts
import { chainweaverAdapterLegacy } from '@kadena/wallet-adapter-chainweaver-legacy';

(async () => {
  const adapterFactory = chainweaverAdapterLegacy();
  const provider = await adapterFactory.detect();
  if (!provider) {
    console.log('Chainweaver Wallet not found.');
    return;
  }
  const adapter = await adapterFactory.adapter(provider);
  await adapter.connect();
  const account = await adapter.getActiveAccount();
  console.log('Connected account:', account);
})();
```

## Manual Usage of the Adapter or Detection

For lower-level access, the following exports are available:

- **`ChainweaverWalletAdapterLegacy`**: The adapter class you can instantiate
  directly.
- **`detectChainweaverProviderLegacy`**: A standalone function that checks
  whether the Chainweaver wallet provider is present. It returns the provider if
  found, or `null` otherwise.

```ts
import {
  ChainweaverWalletAdapterLegacy,
  detectChainweaverProviderLegacy,
} from '@kadena/wallet-adapter-chainweaver-legacy';

(async () => {
  const provider = await detectChainweaverProviderLegacy({ silent: true });
  if (!provider) {
    console.log('Chainweaver Wallet not available.');
    return;
  }
  const adapter = new ChainweaverWalletAdapterLegacy({ provider });
  await adapter.connect();
  console.log('Connected to Chainweaver directly!');
})();
```

## Other Notes

- The adapter internally calls methods like `kadena_sign_v1`, and
  `kadena_quicksign_v1`, mapping them to Chainweaver’s local HTTP endpoints
  (e.g. `http://127.0.0.1:9467/v1/sign` and `/v1/quicksign`).
- If you support multiple wallets in your application, the lazy import in
  `chainweaverAdapterLegacy` helps reduce your initial bundle size by loading
  the Chainweaver adapter code only when the provider is detected.
- Ensure that the user has installed the Chainweaver wallet. If the wallet is
  not installed, detection will yield `null`.
