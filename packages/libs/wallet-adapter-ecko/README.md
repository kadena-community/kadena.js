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

## Usage with wallet-adapter-core

Wallet adapters are designed to work easily with `WalletAdapterClient` from
`@kadena/wallet-adapter-core`. This allows loading in multiple adapters and
automatically detecting which are available and providing a uniform api to
interact with the adapters.

```ts
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';

const client = new WalletAdapterClient([createEckoAdapter()]);
await client.init();
await client.connect('ecko');
```

## Standalone usage with the create method

The primary export is a factory function `createEckoAdapter`, which detects the
Ecko wallet provider and, if found, returns an instance of `EckoAdapter`. If
Ecko is not installed, it returns `null`:

```ts
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';

(async () => {
  const provider = await createEckoAdapter.detect();
  if (!provider) {
    console.log('Ecko Wallet not found.');
    return;
  }

  const adapter = await createEckoAdapter.adapter(provider);

  await adapter.connect();
  const account = await adapter.getActiveAccount();
  console.log('Active account:', account);
})();
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
  const adapter = new EckoAdapter({ provider });
  await adapter.connect();
  console.log('Connected to Ecko directly!');
})();
```

## Supported methods

| Method                | KIP         | Supported |
| --------------------- | ----------- | --------- |
| kadena_sign_v1        | [KIP-17][1] | Yes       |
| kadena_quicksign_v1   | [KIP-17][1] | Yes       |
| kadena_getAccount_v1  | [KIP-37][2] | Yes       |
| kadena_getAccounts_v2 | [KIP-38][3] | Yes       |
| kadena_getNetwork_v1  | [KIP-39][4] | Yes       |
| kadena_getNetworks_v1 | [KIP-40][5] | Yes       |

## Other Notes

- The adapter internally calls `kda_connect`, `kda_requestSign`,
  `kda_disconnect`, and similar Ecko-specific RPC methods (all `"kda_"`
  prefixed).
- If you support multiple wallets in your app, the lazy import in `eckoAdapter`
  can help reduce your initial bundle size, because the Ecko adapter code is
  only loaded if the provider is actually detected.
- Make sure the user has installed the Ecko Wallet extension. Otherwise,
  detection will yield `null`.

[1]: https://github.com/kadena-io/KIPs/blob/master/kip-0017.md
[2]: https://github.com/kadena-io/KIPs/blob/master/kip-0037.md
[3]: https://github.com/kadena-io/KIPs/blob/master/kip-0038.md
[4]: https://github.com/kadena-io/KIPs/blob/master/kip-0039.md
[5]: https://github.com/kadena-io/KIPs/blob/master/kip-0040.md
