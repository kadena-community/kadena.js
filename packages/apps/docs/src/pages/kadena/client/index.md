---
title: Package @kadena/client
description: Kadena makes blockchain work for everyone.
menu: Client
label: Package @kadena/client
order: 7
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Package @kadena/client

`@kadena/client` allows JavaScript/TypeScript users to easily interact with the
Kadena Blockchain.

> **Readme for @kadena/client v1.0.0** This is the README for @kadena/client
> v1.0.0 that introduces a new API\
> To read the README for the old API (< 0.6.1) read [client\_v0.6.1/packages/libs/client/README.md ](https://github.com/kadena-community/kadena.js/blob/%40kadena/client_v0.6.1/packages/libs/client/README.md)

> **[Upgrading from @kadena/client 0.x to 1.0.0 ]()**

## Getting started

### Transaction building

Interaction with the Kadena Blockchain works in various ways. In
`@kadena/client` we expose a [  **builder** pattern ]() and a [  **functional**
pattern ](). They can both be used with or without the use of type-definitions,
but it's recommended to use the type definitions that you can [generate with the
&#x20;`@kadena/pactjs-cli`](/kadena/client/contractbased-interaction-using-kadenaclient#generate-interfaces-from-the-blockchain)

### Signing

There's also information on an [integrated way of signing using Chainweaver ](/kadena/client/signing#integrated-sign-request-to-chainweaver-desktop).
With `@kadena/client` you can also [send a request to the blockchain ](). That's
covered in this article. We'll also be exploring the concepts and rationale of
`@kadena/client`.

*   [@kadena/client ]()
    *   [Package @kadena/client ]()
*   [Getting started ]()
    *   [Transaction building ](/kadena/client/#transaction-building)
    *   [Signing ](/kadena/client/#signing)
    *   [Prerequisites ]()
    *   [Contract-based interaction using @kadena/client ]()
        *   [Generate interfaces from the blockchain ](/kadena/client/contractbased-interaction-using-kadenaclient#generate-interfaces-from-the-blockchain)
            *   [Generate interfaces locally ](/kadena/client/contractbased-interaction-using-kadenaclient#generate-interfaces-locally)
        *   [Downloading contracts from the blockchain ](/kadena/client/contractbased-interaction-using-kadenaclient#downloading-contracts-from-the-blockchain)
    *   [Building a simple transaction from the contract ]()
        *   [Notes ](/kadena/client/building-a-simple-transaction-from-the-contract#notes)
    *   [Signing ]()
        *   [Manually signing the transaction ](/kadena/client/signing#manually-signing-the-transaction)
        *   [Integrated sign request to Chainweaver desktop ](/kadena/client/signing#integrated-sign-request-to-chainweaver-desktop)
        *   [Signing with a WalletConnect compatible wallet ](/kadena/client/signing#signing-with-a-walletconnect-compatible-wallet)
    *   [Using the commandBuilder ]()
    *   [Using FP approach ]()
    *   [Send a request to the blockchain ]()
    *   [Upgrading from @kadena/client 0.x to 1.0.0 ]()
        *   [Sending a transaction 'transfer' ](/kadena/client/upgrading-from-kadenaclient-0x-to-100#sending-a-transaction-transfer)
        *   [Read from the blockchain 'getBalance' ](/kadena/client/upgrading-from-kadenaclient-0x-to-100#read-from-the-blockchain-getbalance)
    *   [Further development ]()
    *   [Contact the team ]()
