---
title: JavaScript client API
description:
  The Chainweb JavaScript client API provides a TypeScript based application programming interface API for calling Chainweb node endpoints.
menu: Chainweb REST API
label: Bindings and types
order: 3
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Bindings and types for the Chainweb API

The `chainwebjs` package provides high level Typescript bindings and types for the Kadena [Chainweb API](/reference/chainweb-api).

## Install

You can install this package with `npm` or `yarn`.

To install using `npm`, run the following command:

```sh
npm install @kadena/chainwebjs
```

To install using `yarn`, run the following command:

```sh
yarn add @kadena/chainwebjs
```

## Usage

To define a constant reference for the `chainwebjs` library, add the following line to your program:

```javascript
const chainweb = require('@kadena/chainwebjs');
```

To import `chainwebjs` functions, add the following line to your program:

```javascript
import chainweb from '@kadena/chainwebjs';
```

## Common parameters

- `network`: the Kadena Chainweb network identifier.
- `host`: the Chainweb API host URL, including the schema and possibly the port.

Currently, no authentication or extra headers are supported. 
If you need these features, you can request support by submitting a new issue in the Github repository.

Some functions require a `chainId` parameter (or an array of chain IDs). 
Chain identifier should be provided as string values representing the number of chains in the respective `network`. 
There is no default value for the chainId.
The valid values for the Kadena test and main network are "0" through "19".

If a `depth` parameter is required, a value of `3` or larger is a safe choice.

Functions return items in order ascending by block height. 
Because the server usually returns items in reverse order, functions buffer all items from possibly
several pages, which can take some time. 
When fetching larger numbers of items, you can use the functions in the package iteratively and possibly
also asynchronously to increase performance.

### Cuts

To run a command equivalent to sending a request to `GET https://{baseURL}/cut/peer` to retrieve peer node information about the `cut` peer-to-peer network:

```javascript
chainweb.cut.peers().then((x) => console.log('Cut Peers:', x));
```

To run a command equivalent to sending a request to `GET https://{baseURL}/cut` to query a Chainweb node for the current cut:

```javascript
chainweb.cut.current().then((x) => console.log('Current Cut:', x));
```

### Chain items

Chain items only include items from the currently winning branch of the chain.
Orphaned blocks from past forks are not included. In order to avoid retrieving
items from a currently winning fork that is orphaned later on it is recommended
to only retrieve confirmed items by using an appropriate the `depth` parameter.

There are functions for three kinds of chain items:

- Headers: these are just the block headers. These functions are generally the
  most efficient.
- Blocks: these include the block headers and the block payloads, including
  transaction outputs. Querying payloads with outputs requires an extra
  round-trip.
- Transactions: these are just the transactions along with the transaction
  output. Transactions from various blocks are flattened into a single array or
  stream. Each item contains a `height` property that indicates the block height
  at which it occurred.
- Events: these are just the events from transaction outputs. Events from
  various blocks are flattened into a single array or stream. Each item contains
  a `height` property that indicates the block height at which it occurred.

### Block chain items by height

```javascript
chainweb.header.height(0, 1000000).then((x) => console.log('Header:', x));
chainweb.block.height(0, 1000000).then((x) => console.log('Block:', x));
chainweb.transaction
  .height(0, 1000000)
  .then((x) => console.log('Transactions:', x));
chainweb.event.height(0, 1000000).then((x) => console.log('Events:', x));
```

The parameters, in order, are: chain id and block height.

### Block chain items by block hash

```javascript
const bh = 'k0an0qEORusqQg9ZjKrxa-0Bo0-hQVYLXqWi5LHxg3k';
chainweb.header.blockHash(0, bh).then((x) => console.log('Header:', x));
chainweb.block.blockHash(0, bh).then((x) => console.log('Block:', x));
chainweb.transaction
  .blockHash(0, bh)
  .then((x) => console.log('Transactions:', x));
chainweb.event.blockHash(0, bh).then((x) => console.log('Events:', x));
```

The parameters, in order, are: chain id and block hash.

### Recent block chain items

These functions return items from recent blocks in the block history starting at
a given depth.

The depth parameter is useful to avoid receiving items from orphaned blocks.

```javascript
chainweb.header.recent(0, 3, 10).then((x) => console.log('Headers:', x));
chainweb.block.recent(0, 3, 10).then((x) => console.log('Blocks:', x));
chainweb.transaction
  .recent(0, 3, 50)
  .then((x) => console.log('Transactions:', x));
chainweb.event.recent(0, 3, 1000).then((x) => console.log('Events:', x));
```

The parameters, in order, are: chain id, depth, and maximum number of returned
items.

### Ranges of block chain items

These functions query items from a range of block heights and return the result
as an array.

```javascript
chainweb.header
  .range(0, 1500000, 1500010)
  .then((x) => console.log('Headers:', x));
chainweb.block
  .range(0, 1500000, 1500010)
  .then((x) => console.log('Blocks:', x));
chainweb.transaction
  .range(0, 1500000, 1500010)
  .then((x) => console.log('Transactions:', x));
chainweb.event
  .range(0, 1500000, 1500010)
  .then((x) => console.log('Events:', x));
```

The parameters, in order, are: chain id, start height, and end height.

### Streams

Streams are backed by EventSource clients that retrieve header update events
from the Chainweb API.

The depth parameter is useful to avoid receiving items from orphaned blocks.

The functions buffer, filter, and transform the original events and generate a
stream of derived items to which a callback is applied.

The functions also return the underlying EventSource object, for more advanced
low-level control.

```javascript
const chains = [0, 1, 9];

const hs = chainweb.header.stream(2, chains, console.log);
const bs = chainweb.block.stream(2, chains, console.log);
const ts = chainweb.transaction.stream(2, chains, (x) => {
  console.log(x);
});
const es = chainweb.event.stream(2, chains, console.log);
```

The parameters, in order, are: depths, included chains, and a function that is
called for each item in the stream.

Streams are online and only return items from blocks that got mined after the
stream was started. They are thus useful for prompt notification of new items.
In order of exhaustively querying all, including old, items, one should also use
`range` or `recent` queries for the respective type of item.

## Example values

Example of a block object:

```javascript
{
  header: {
    creationTime: 1617709987033643,
    parent: 'xv73bXWz1gnrqTisA_gPk1uQsAB5mbpcc1K28hbc1-g',
    height: 1510411,
    hash: 'uq_j7n0Oi_kn_MOCzCnab5ceJoTh1107ovP6sEupL_g',
    chainId: 14,
    weight: 'ANTVgl6hNGp2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    featureFlags: 0,
    epochStart: 1617707264590744,
    adjacents: {
      '4': 'QjY3cD3SI3ZXFLJSEBs9vQ4inE6kttzloHr7Xw7Jb1Q',
      '13': 'pVCx1m9vdwkUuL2IY1a4YFH5pR26LYuDlvTB5EET1lc',
      '15': 'suYkkMMTC91ezPrL0lWPJfb4jMdPwDrAZ5QDbTHa094'
    },
    payloadHash: 'uRNlKTYUX8le57PUU7PegH6R4sQ_BRcbyM_8X0SmqGU',
    chainwebVersion: 'mainnet01',
    target: 'HaIMMhav3qFjTsesHlofQs1qXtA03KwCoAkAAAAAAAA',
    nonce: '5090157328105015810'
  },
  payload: {
    transactions: [],
    minerData: {
      account: '6d87fd6e5e47185cb421459d2888bddba7a6c0f2c4ae5246d5f38f993818bb89',
      predicate: 'keys-all',
      'public-keys': [Array]
    },
    transactionsHash: 'PZA7NIdgDatkTRZ8AOSI7dOOJzhGAhe7JkovnMp1xks',
    outputsHash: 'RJVkqVIwW2U6na2pExx866Ld_q2Hw0ZxHC_PScDpsZo',
    payloadHash: 'uRNlKTYUX8le57PUU7PegH6R4sQ_BRcbyM_8X0SmqGU',
    coinbase: {
      gas: 0,
      result: [Object],
      reqKey: 'Inh2NzNiWFd6MWducnFUaXNBX2dQazF1UXNBQjVtYnBjYzFLMjhoYmMxLWci',
      logs: 'NI1wv5IbNktRCAQXB4NNuiZHqzyvhjXIrndkgEGLtUg',
      metaData: null,
      continuation: null,
      txId: 671318
    }
  }
}
```

Example of a transaction object:

```javascript
{
  transaction: {
    hash: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
    sigs: [ [Object] ],
    cmd: {
      networkId: 'mainnet01',
      payload: [Object],
      signers: [Array],
      meta: [Object],
      nonce: '"\\"2021-04-06T19:03:18.773Z\\""'
    }
  },
  output: {
    gas: 392,
    result: { status: 'success', data: [Object] },
    reqKey: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
    logs: 'Go2w3KEnTqjgry8l5ucz2u3nmVGJN6sEdxI6YGiTF7Q',
    metaData: null,
    continuation: {
      executed: null,
      pactId: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
      stepHasRollback: false,
      step: 0,
      yield: [Object],
      continuation: [Object],
      stepCount: 2
    },
    txId: 2026960
  },
  height: 1511402
```

Example of an event object:

```javascript
{
  params: [
    '4677a09ea1602e4e09fe01eb1196cf47c0f44aa44aac903d5f61be7da3425128',
    'f6357785d8b147c1fac66cdbd607a0b1208d62996d7d62cc92856d0ab229bea2',
    10462.28
  ],
  name: 'TRANSFER',
  module: { namespace: null, name: 'coin' },
  moduleHash: 'ut_J_ZNkoyaPUEJhiwVeWnkSQn9JT9sQCWKdjjVVrWo',
  height: 1511601
}
```
