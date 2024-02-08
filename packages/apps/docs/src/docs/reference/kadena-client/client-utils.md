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

Use `submitClient` to call the `submit` endpoint on a Chainweb node and return the result for the specified chain, network, and request key.

### Basic usage

```typescript
submitClient _chainId_ _networkId_ _requestKey_
```

### Parameters

You must pass the following arguments to the `submitClient` command:

| Parameter | Type | Description
| --------- | ---- | -----------
| `chainId` | string | Specifies the chain for the client to connect to using the chain identifier. Valid values are strings representing chain “0” through chain “19”.
| `networkId` | string | Specifies the network identifier for the client to connect to. Valid values are development, Testnet, and Mainnet.
| `requestKey` | string | Specifies the request key to determine if the request was successful.

### Return value

The `submitClient` call returns the following if successfully executed.

### Example

The following example submits a mock transaction using chainId "1" and the networkId "test-network" to test the submitClient call.

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient, ITransactionDescriptor } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { submitClient } from '../client-helpers';

describe('submitClient', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the submit endpoint and returns the result', async () => {
    const client: IClient = {
      preflight: vi.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
      submitOne: vi.fn().mockResolvedValue({
        chainId: '1',
        networkId: 'test-network',
        requestKey: 'test-request-key',
      } as ITransactionDescriptor),
      listen: vi.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const sign = vi.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] }));
    const submit = submitClient(
      { sign, defaults: { networkId: 'test-network' } },
      client,
    );
    const result = await submit(
      composePactCommand(
        execution('(test 1 2 3)'),
        addSigner('pk'),
        setMeta({ chainId: '1' }),
      ),
    )
      .on('sign', (tx) => {
        expect(tx).toEqual({
          cmd: '{"payload":{"exec":{"code":"(test 1 2 3)","data":{}}},"signers":[{"pubKey":"pk","scheme":"ED25519"}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"","ttl":28800,"creationTime":1698278400,"chainId":"1"},"nonce":"kjs:nonce:1698278400000","networkId":"test-network"}',
          hash: 'ABVQq4j4C4atHw9SzbY7QuSzhyXIkOGo_MI0m9_wT4s',
          sigs: [
            {
              sig: 'sig-hash',
            },
          ],
        });
      })
      .on('preflight', (result) => {
        expect(result).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      })
      .on('submit', (trDesc) => {
        expect(trDesc).toEqual({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'test-request-key',
        });
      })
      .on('listen', (result) => {
        expect(result).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      });

    await expect(result.execute()).resolves.toEqual('test-data');
  });
});
```