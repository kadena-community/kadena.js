---
title: Building a simple transaction from the contract
description: Kadena makes blockchain work for everyone.
menu: Building a simple transaction from the contract
label: Building a simple transaction from the contract
order: 3
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Building a simple transaction from the contract

Take a look at
[https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts ](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts)
for a complete example.

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`):

```ts
import { Pact } from '@kadena/client';

const unsignedTransaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer('k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  )
  .addSigner('your-pubkey', (withCapability) => [
    // add necessary coin.GAS capability (this defines who pays the gas)
    withCapability('coin.GAS'),
    // add necessary coin.TRANSFER capability
    withCapability('coin.TRANSFER', 'k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  ])
  .setMeta({ chainId: '1', senderAccount: 'your-pubkey' })
  .setNetworkId('mainnet01')
  .createTransaction();
```

### Notes

*   Namespaced arguments (`k:`, `w:` etc) are account names, where non-namespaced
    arguments are assumed to be public keys.
*   The contract doesn't specify whether you need to pass an **account name** or
    **public key**. This is knowledge that can be obtained by inspecting the
    contract downloaded earlier or consulting the documentation for the contract.
*   The `addSigner` function accepts the `public-key` of the signer and let signer
    add the capabilities they want to sign for. Note that `coin.GAS` doesn't have
    any arguments, but `coin.TRANSFER` does.
*   The `setMeta` argument object has a `senderAccount` property. This is an
    `account` and could be `gas station` account in some scenarios.
*   To add an **Unrestricted Signer** ([Unscoped Signature ](https://pact-language.readthedocs.io/en/stable/pact-reference.html?highlight=signer#signature-capabilities)), call `addSigner`
    without extra arguments
