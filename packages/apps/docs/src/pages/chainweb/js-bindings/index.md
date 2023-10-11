---
title: API Documentation
description: Kadena makes blockchain work for everyone.
menu: JS bindings
label: API Documentation
order: 3
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainwebjs/README.md
layout: full
tags: [chainweb,javascript,typescript,stream]
lastModifiedDate: Mon, 10 Jul 2023 09:00:36 GMT
---
# API Documentation

### Usage Examples

```javascript
const chainweb = require('@kadena/chainwebjs');
```

```javascript
import chainweb from '@kadena/chainwebjs';
```

### Common parameters:

*   `network`: the Kadena Chainweb network identifier.
*   `host`: the Chainweb API host URL, including the schema and possibly the port.

Currently, no authentication or extra headers are supported. If you need these
features, you may request support by submitting an new issue in the Github
repository.

Some functions require a `chainId` parameter (or an array of chain IDs). Chain
IDs should be provided as numbers from the set of supported chains of the
respective `network`. There is no default value.

When a `depth` parameter is required, a value of `3` or larger is a safe choice.

Functions return items in order ascending by block height. Because the server
usually returns items in reverse order, functions buffer all items from possibly
several pages, which can take some time. When fetching larger numbers of items
it is recommended to use the functions in the package iteratively and possibly
also asynchronously in order to increase performance.

### Cuts

```javascript
chainweb.cut.peers().then((x) => console.log('Cut Peers:', x));
chainweb.cut.current().then((x) => console.log('Current Cut:', x));
```

### Chain Items

Chain items only include items from the currently winning branch of the chain.
Orphaned blocks from past forks are not included. In order to avoid retrieving
items from a currently winning fork that is orphaned later on it is recommended
to only retrieve confirmed items by using an appropriate the `depth` parameter.

There are functions for three kinds of chain items:

*   Headers: these are just the block headers. These functions are generally the
    most efficient.
*   Blocks: these include the block headers and the block payloads, including
    transaction outputs. Querying payloads with outputs requires an extra
    round-trip.
*   Transactions: these are just the transactions along with the transaction
    output. Transactions from various blocks are flattened into a single array or
    stream. Each item contains a `height` property that indicates the block height
    at which it occurred.
*   Events: these are just the events from transaction outputs. Events from
    various blocks are flattened into a single array or stream. Each item contains
    a `height` property that indicates the block height at which it occurred.

### Block Chain Items By Height

```javascript
chainweb.header.height(0, 1000000).then((x) => console.log('Header:', x));
chainweb.block.height(0, 1000000).then((x) => console.log('Block:', x));
chainweb.transaction
  .height(0, 1000000)
  .then((x) => console.log('Transactions:', x));
chainweb.event.height(0, 1000000).then((x) => console.log('Events:', x));
```

The parameters, in order, are: chain id and block height.

### Block Chain Items By Block Hash

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

### Recent Block Chain Items

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

### Ranges of Block Chain Items

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
