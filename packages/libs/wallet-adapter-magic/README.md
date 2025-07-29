# Magic Wallet Adapter

This package provides an adapter for the Magic Wallet extension on Kadena.

## Installation

```bash
npm install @kadena/wallet-adapter-magic
# or
yarn add @kadena/wallet-adapter-magic
# or
pmpm add @kadena/wallet-adapter-magic
```

## Usage with wallet-adapter-core

Wallet adapters are designed to work easily with `WalletAdapterClient` from
`@kadena/wallet-adapter-core`. This allows loading in multiple adapters and
automatically detecting which are available and providing a uniform api to
interact with the adapters.

```ts
import { magicAdapter } from '@kadena/wallet-adapter-magic';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';

const client = new WalletAdapterClient([magicAdapter]);
await client.init();
await client.connect('magic');
```

## Factory Usage

The primary export is a factory function `magicAdapter`, which detects the Magic
wallet provider and, if found, returns an instance of `MagicWalletAdapter`. If
Magic is not installed, it returns `null`:

```ts
import { magicAdapter } from '@kadena/wallet-adapter-magic';

(async () => {
  const provider = await magicAdapter.detect();
  if (!provider) {
    console.log('Magic Wallet not found.');
    return;
  }

  const adapter = await magicAdapter.adapter(provider);

  await adapter.connect();
  const account = await adapter.getActiveAccount();
  console.log('Active account:', account);
})();
```

## Manual Usage of the Adapter or Detection

If you need lower-level access, the following are also exported:

- **`MagicAdapter`**: The actual adapter class, in case you want to instantiate
  it manually without relying on the lazy-loading factory.
- **`detectMagicProvider`**: A standalone function that checks whether the Magic
  wallet is present. It returns the provider if found, or `null` otherwise.

```ts
import {
  MagicAdapter,
  detectMagicProvider,
} from '@kadena/wallet-adapter-magic';

(async () => {
  const provider = await detectMagicProvider({ silent: true });
  if (!provider) {
    console.log('Magic not available.');
    return;
  }
  const adapter = new MagicWalletAdapter({ provider });
  await adapter.connect();
  console.log('Connected to Magic directly!');
})();
```

## Supported methods

| Method                | KIP         | Supported |
| --------------------- | ----------- | --------- |
| kadena_sign_v1        | [KIP-17][1] | No        |
| kadena_quicksign_v1   | [KIP-17][1] | Yes       |
| kadena_getAccount_v1  | [KIP-37][2] | Yes       |
| kadena_getAccounts_v2 | [KIP-38][3] | Yes       |
| kadena_getNetwork_v1  | [KIP-39][4] | No        |
| kadena_getNetworks_v1 | [KIP-40][5] | No        |
