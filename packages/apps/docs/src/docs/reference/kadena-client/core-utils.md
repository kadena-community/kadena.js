---
title: Core utilities
description:
  The `@kadena/client-utils` library includes several modules to provide a TypeScript-based application programming interface (API) for interacting with Pact smart contracts and the Kadena network. The modules include helper functions for many common tasks in core Pact modules, such as the `coin` module, and `core` functions that you can use to develop new interfaces for custom contracts.
menu: Frontend libraries
label: Core utilities
order: 1
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Core utilities

The `@kadena/client-utils` library includes several modules to provide a TypeScript-based application programming interface (API) for interacting with Pact smart contracts and the Kadena network.
The `core` module provides utilities that you can use to develop your own APIs tht connect to the Kadena blockchain through the Kadena client interface, including functions that can be used for any type of smart contract.

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

After you download the latest package, you can import core functions into TypeScript programs with statements similar to the following example:

```typescript
import { describeModule } from '@kadena/client-utils/core';
```

## asyncPipe

Use `asyncPipe` to open a connection to the Kadena network and execute multiple functions in order to return a single result. 
This utility enables you to pass the output from the first function as input to a second function and return the combined results.
The `asyncPipe` function is a core component that provides the foundation that many other client utilities depend on. 

### Basic usage

```typescript
asyncPipe( function1(), function2())
```

### Example

The following example pipes the result from the `appendAsync` function to the `asyncPipe` function and returns the combined results.

```
const asyncAppend = (append: string) => (input: string) =>
      Promise.resolve(`${input} ${append}`);

    const appendAsync = asyncPipe(
      asyncAlways,
      asyncAppend('one'),
      asyncAppend('two'),
    );
    const result = await appendAsync('hello');
    expect(result).toEqual('hello one two');
```

## crossChainClient

Use `crossChainClient` to complete a cross-chain transfer using the Kadena client connection to the blockchain.

### Basic usage

```typescript

```

### Example

The following example ...

## dirtyReadClient

Use `dirtyReadClient` to read a raw result from the Kadena blockchain without submitting a transaction.
This function enables to read the result using the Kadena client connection to the blockchain.

### Basic usage

```typescript
dirtyReadClient(_chainId_, _networkId_, _requestKey_)
```

### Example

The following example ...

## estimateGas

Use estimateGas Client to estimate the gas required to execute a transaction using the Kadena client connection to the blockchain and return the result.

### Basic usage

```typescript
estimateGas( command )
```

### Example

The following example ...

## preflightClient

Use `preflightClient` to prepare a preflight request for a signed transaction to connect to the Kadena blockchain without submitting a transaction. The response to the preflight request contains information about the expected success of the transaction and the how much gas the transaction requires. Preflight requests help to ensure that clients don't send transactions to the blockchain that are likely to fail.

Because you must for pay processing any transaction request even if a transaction fails, you should use a preflight request for any computationally expensive transactions—like deploying a module—before sending the actual transaction to the blockchain.

### Basic usage

```typescript
submitClient(_chainId_, _networkId_, _requestKey_)
```

### Example

The following example ...

## queryAllChainsClient

Use `queryAllChainsClient` to send a query to all chains in the network and return the result using the Kadena client connection to the blockchain.

### Basic usage

```typescript
submitClient(_chainId_, _networkId_, _requestKey_)
```

### Example

The following example ...

## submitClient

Use `submitClient` to call the `submit` endpoint on a Chainweb node and return the result for the specified chain, network, and request key.

### Basic usage

```typescript
submitClient(_chainId_, _networkId_, _requestKey_)
```

### Parameters

You must pass the following arguments to the `submitClient` command:

| Parameter | Type | Description |
| --- | --- | --- |
| `chainId` | string | Specifies the chain for the client to connect to using the chain identifier. Valid values are strings representing chain “0” through chain “19”. |
| `networkId` | string | Specifies the network identifier for the client to connect to. Valid values are development, Testnet, and Mainnet. |
| `requestKey` | string | Specifies the request key to determine if the request was successful. |

### Example

The following example submits a mock transaction using chainId "1" and the networkId "test-network" to test the `submitClient` call.

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