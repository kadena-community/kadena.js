---
title: Using the commandBuilder
description: Kadena makes blockchain work for everyone.
menu: Using the commandBuilder
label: Using the commandBuilder
order: 5
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Using the commandBuilder

You may prefer to not generate JavaScript code for your contracts or use
templates. In that case, you can use the `commandBuilder` function to build a
command and submit the transaction yourself:

```ts
import { Pact } from '@kadena/client';

const client = createClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact',
);

const unsignedTransaction = Pact.builder
  .execution('(format "Hello {}!" [(read-msg "person")])')
  // add signer(s) if its required
  .addSigner('your-pubkey')
  // set chain id and sender
  .setMeta({
    chainId: '8',
    senderAccount: 'your-k-or-w-account-or-gas-station',
  })
  // set networkId
  .setNetworkId('mainnet01')
  // create transaction with hash
  .createTransaction();

// Send it or local it
client.local(unsignedTransaction);
client.submit(unsignedTransaction);
```
