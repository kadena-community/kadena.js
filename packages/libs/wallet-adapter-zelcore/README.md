# Wallet Adapter Zelcore

This package provides an adapter for the Zelcore Wallet on Kadena. It extends a
base adapter while preserving the `"kadena_"`‑prefixed methods expected by
`BaseWalletAdapter` by mapping them to the Zelcore local HTTP API.

## Installation

```bash
npm install @kadena/wallet-adapter-zelcore
# or
yarn add @kadena/wallet-adapter-zelcore
# or
pmpm add @kadena/wallet-adapter-zelcore
```

## Factory Usage

The primary export is a factory function `createZelcoreAdapter`, which detects
the Zelcore provider and, if found, returns an adapter instance. If the Zelcore
provider is not available, detection returns `null`:

```ts
import { createZelcoreAdapter } from '@kadena/wallet-adapter-zelcore';

(async () => {
  const adapterFactory = createZelcoreAdapter();
  const provider = await adapterFactory.detect();
  if (!provider) {
    console.log('Zelcore Wallet not found.');
    return;
  }
  const adapter = await adapterFactory.adapter(provider);
  await adapter.connect();
  const account = await adapter.getActiveAccount();
  console.log('Connected account:', account);
})().catch((e) => console.error);
```

## Manual Usage of the Adapter or Detection

For lower-level access, the following exports are available:

- **`ZelcoreAdapter`**: The adapter class you can instantiate directly.
- **`detectZelcoreProvider`**: A standalone function that checks whether the
  Zelcore wallet provider is present. It returns the provider if found, or
  `null` otherwise.

```ts
import {
  ZelcoreAdapter,
  detectZelcoreProvider,
} from '@kadena/wallet-adapter-zelcore';

(async () => {
  const provider = await detectZelcoreProvider({ silent: true });
  if (!provider) {
    console.log('Zelcore Wallet not available.');
    return;
  }
  const adapter = new ZelcoreWalletAdapter({ provider });
  await adapter.connect();
  console.log('Connected to Zelcore directly!');
})();
```

## Supported methods

| Method                | KIP         | Supported |
| --------------------- | ----------- | --------- |
| kadena_sign_v1        | [KIP-17][1] | Yes       |
| kadena_quicksign_v1   | [KIP-17][1] | Yes       |
| kadena_getAccount_v1  | [KIP-37][2] | Yes       |
| kadena_getAccounts_v2 | [KIP-38][3] | Yes       |
| kadena_getNetwork_v1  | [KIP-39][4] | No        |
| kadena_getNetworks_v1 | [KIP-40][5] | No        |

## Other Notes

- The adapter internally calls methods like `kadena_sign_v1`, and
  `kadena_quicksign_v1`, mapping them to Zelcore’s local HTTP endpoints (e.g.
  `http://127.0.0.1:9467/v1/sign` and `/v1/quicksign`).
- If you support multiple wallets in your application, the lazy import in
  `zelcoreAdapter` helps reduce your initial bundle size by loading the Zelcore
  adapter code only when the provider is detected.
- Ensure that the user has installed the Zelcore wallet. If the wallet is not
  installed, detection will yield `null`.
