---
title: Built-in utilities
description:
  The `@kadena/client-utils` library includes several modules to provide a TypeScript-based application programming interface (API) for interacting with Pact smart contracts and the Kadena network. The modules include helper functions for many common tasks in core Pact modules, such as the `coin` module, and `core` functions that you can use to develop new interfaces for custom contracts.
menu: Frontend libraries
label: Client utilities
order: 1
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Built-in utilities

The `@kadena/client-utils` library includes several modules to provide a TypeScript-based application programming interface (API) for interacting with Pact smart contracts and the Kadena network.
The built-in module provides basic functions to return module descriptions and create princiipal accounts.
These functions are broadly useful for any type of application that access the Kadena blockchain.

## Before you begin

You must have `node.js` and `npm`, or an equivalent package manager, installed in your development environment.
You can run the following commands to check whether `node` and `npm` are installed locally:

```bash
node --version
npm --version
```

## Install

You can install the `@kadena/client-utils` library with the following command:

```bash
npm install @kadena/client-utils
```

After you download the latest package, you can import built-in functions into TypeScript programs with statements similar to the following example:

```typescript
import { describeModule } from '@kadena/client-utils/built-in';
```

## createPrincipal

Use `createPrincipal` to create a principal account based on one public key.
By default, the principal account is always assigned the `keys-all` predicate function.

```typescript
createPrincipal(keyset)
```

### Parameters

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| keyset | object | Specifies the public for the single owner of the principal account and, optionally, the predicate function. |

### Return value

This function returns the principal account as a string.

### Example

The following example illustrates how to use the `createPrincipal` function in a TypeScript program:

```typescript
TBD
```

## deployContract

Use `deployContract` to deploy a Pact module on a specific Kadena network and chain.

```typescript
deployContract(contractCode, transactionBody)
```

### Parameters

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| contractCode | object | Specifies the contract you want to deploy. |
| transactionBody | object | Specifies the transaction properties. |

The `transactionBody` object contains the following properties:

```
{
  chainId: string,
  networkId: string,
  signers: [list],
  meta: {
    gasLimit: integer,
    chainId: string,
    ttl: integer,
    senderAccount: string,
}
```

### Return value

This function returns a boolean value to indicate whether the contract was successfully deployed or failed.

### Example

The following example illustrates how to use the `deployContract` function in a TypeScript program:

```typescript
TBD
```

## describeModule

Use `describeModule` to return detailed information about a specified Pact module.

```typescript
describeModule(module)
```

### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| module | string | Specifies the name of the module to describe.

### Return values

This function returns the IDescribeModuleOutput object the following properties:

```
 {
  hash: string;
  blessed: string[];
  keyset: string;
  interfaces: string[];
  name: string;
  code: string;
}
```

### Example

The following example illustrates how to use the `describeModule` function in a TypeScript program:

```typescript
TBD
```

## listModules

Use `listModules` to list the Pact module currently available in the network that you're connected to.

```
listModules
```

### Return values

This function returns a list of module names.

### Example

The following example illustrates how to use the `listModule` function in a TypeScript program:

```typescript
TBD
```
