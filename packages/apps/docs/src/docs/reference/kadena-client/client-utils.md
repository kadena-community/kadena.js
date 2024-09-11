---
title: Client utilities
description: The `@kadena` libraries provide a TypeScript based application programming interface API for interacting with smart contracts and the Kadena network. The libraries include helper functions for many common tasks in core Pact modules, such as the `coin` module, and `core` functions that you can use to develop new interfaces for custom contracts.
menu: Frontend libraries
label: Client utilities
order: 1
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Kadena client utilities

The `@kadena/client-utils` library provides a TypeScript based application programming interface API for interacting with smart contracts and the Kadena network. The library includes helper functions for the `coin` module that you can import using `@kadena/client-utils/coin`. For example, you can import specific `coin` module functions into a TypeScript program with the following statement:

```typescript
import { getBalance, transferCrossChain } from '@kadena/client-utils/coin';
```

The library also exports `core` utilities that you can use to develop your own API functions for any type kind of smart contract.

The client-utils package contains functions exported into the following modules:

- built-in
- coin
- core
- marmalade
- nodejs
- webauthn

## Built-in utilities

The Kadena `client-utils` package includes a `built-in` module with basic functions to create principal accounts, deploy contracts, and return module information.
These functions are broadly useful for any type of application that accesses the Kadena blockchain.
The `built-in` module includes the following helper functions:

- createPrincipal
- deployContract
- describeModule
- listModules

For details about the `built-in` functions in the Kadena client library, see [Built-in utilities](/reference/kadena-client/built-in-utils).

## Coin module utilities

The Kadena `client-utils` package provides access to the following `coin` module functions by using the Kadena client interface to connect to the Kadena blockchain:

- createAccount
- details
- getBalance
- rotate
- safeTransfer
- transferCreate
- transferCrossChain
- transfer

## Core utilities

The Kadena `client-utils` package includes a `core` module that provides helper functions to perform basic tasks that enable an application to interact with the blockchain.

You can use many of the `core` utilities to develop custom functions that connect to the Kadena blockchain through the Kadena client interface, including functions that can be used for any type of smart contract.
For example, the core module includes the following functions:

- asyncPipe
- crossChainClient
- estimateGas
- preflightClient
- queryAllChainsClient
- readDirtyClient
- submitClient

For details about the `core` functions in the Kadena client library, see [Core utilities](/reference/kadena-client/core-utils).

## Marmalade utilities

The Kadena `client-utils` package includes utilities for all Marmalade token standard functions, including the functions to create, mint, and transfer tokens.
For details about the Marmalade client library functions, see [Marmalade client utilities](/reference/nft-ref/client-utils).

## Nodejs utilities

The Kadena `client-utils` package includes a `nodejs` module that provides helper functions to support the deployment of applications that use the Kadena client interface.

- deployFromDirectory
- deployTemplate
- yamlConverter

## WebAuthn utilities

The Kadena `client-utils` package includes a `webauthn` module that provides helper functions to support WebAuthn authentication using the Kadena client interface.

- getWebauthnAccount
- getWebauthnGuard
