---
title: Kadena client utilities
description:
  The `@kadena/client-utils` library provides a TypeScript based application programming interface API for interacting with smart contracts and the Kadena network. The library includes helper functions for the `coin` module that you can import using `@kadena/client-utils/coin` and `core` functions that you can use to develop interfaces for custom contracts.
menu: Reference
label: Kadena client
order: 4
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Kadena client utilities

The `@kadena/client-utils` library provides a TypeScript based application programming interface API for interacting with smart contracts and the Kadena network. 
The library includes helper functions for the `coin` module that you can import using `@kadena/client-utils/coin`.
For example, you can import specific `coin` module functions into a TypeScript program with the following statement:

```typescript
import { getBalance, transferCrossChain } from "@kadena/client-utils/coin"
```
  
The library also exports `core` utilities that you can use to develop your own API functions for any type kind of smart contract.

The client utilities are listed alphabetically in this reference to make they easy to find by name.
However, you typically call the utilities in the following order to represent the normal workflow:

- Open a connection with asyncPipe.
- Submit a request with submitClient.
- Check whether the request is likely to succeed with preflightClient.
- Read the raw response with dirtyReadClient.
- Complete the transaction with crossChainClient.

## Built-in utilities

The Kadena `client-utils` package includes the following `built-in` helper functions:

- [createPrincipal](#createprincipal)
- [describeModule](#describemodule)

# Coin module utilities

The Kadena `client-utils` package provides access the following `coin` module functions:

- createAccount
- details
- getBalance
- rotate
- safeTransfer
- transferCreate
- transferCrosschain
- transfer

## Core utilities

The Kadena `client-utils` package includes the following `core` helper functions:

- asyncPipe
- client-helpers
- cross-chain
- estimateGas
- preflight
- readDirtyClient
- submitClient

## asyncPipe

Use `asyncPipe` to ...

### Basic usage

### Parameters

### Return value

### Example

## createPrincipal

Use `createPrincipal` to ...

### Basic usage

### Parameters

### Return value

### Example

## crossChainClient

Use `crossChainClient` to ...

### Basic usage

### Parameters

### Return value

### Example

## describeModule

Use `describeModule` to return detailed information about a specified Pact module.

### Basic usage

desccribeModule _module_

### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| module | string | Specifies the name of the module to describe.

### Return values

This function returns the following information:

blessed: string[];
code: string;
hash: string;
interfaces: string[];
keyset: string;
name: string;

### Example

## dirtyReadClient

se `dirtyReadClient` to ...

### Basic usage

### Parameters

### Return value

### Example

## estimateGas

se `estimateGas` to ...

### Basic usage

### Parameters

### Return value

### Example

## preflightClient

se `preflightClient` to ...

### Basic usage

### Parameters

### Return value

### Example

## submitClient

Use `submitClient` to ...

### Basic usage

### Parameters

### Return value

### Example

