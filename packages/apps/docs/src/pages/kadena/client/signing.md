---
title: Signing
description: Kadena makes blockchain work for everyone.
menu: Signing
label: Signing
order: 4
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript, typescript, signing, transaction, typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---

# Signing

Signing can be done in various ways. Either manually, by signing the hash of the
transaction or with a wallet. There's currently two options in `@kadena/client`
to sign with a wallet:

1.  [WalletConnect (preferred) ](/kadena/client/signing#signing-with-a-walletconnect-compatible-wallet)
2.  [Chainweaver ](/kadena/client/signing#integrated-sign-request-to-chainweaver-desktop)

### Manually signing the transaction

The unsignedTransaction can be pasted into the `SigData` of Chainweaver.

The `createTransaction` function will return the transaction. The hash will be
calculated and the command will be serialized.

### Integrated sign request to Chainweaver desktop

Using the `transaction` we can send a sign request to Chainweaver.

**Note:** This can only be done using the desktop version, not the web version,
as it's [exposing port 9467 ](https://kadena-io.github.io/signing-api/).

```ts
import { signWithChainweaver } from '@kadena/client';

// use the transaction, and sign it with Chainweaver
const signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

> To **send** the transaction to the blockchain, continue with
> [**Send a request to the blockchain**]()

### Signing with a WalletConnect compatible wallet

There's several steps to setup a WalletConnect connections and sign with
WalletConnect.

1.  Setting up the connection using
    [`ClientContextProvider.tsx `](https://github.com/kadena-io/wallet-connect-example/blob/main/src/providers/ClientContextProvider.tsx#L69C6-L69C6)
2.  Use `signWithWalletConnect` to request a signature from the wallet
    (`Transaction.tsx`)\[[https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104 ](https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104)]
