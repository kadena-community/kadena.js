---
title: Stream client API
description:
  The Chainweb stream client API provides a TypeScript based application programming interface API for calling Chainweb node endpoints.
menu: Chainweb REST API
label: Streaming client
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Chainweb streaming client

Kadena Chainweb clients are application programming interfaces that provide TypeScript-based calls for interacting with Chainweb nodes on the Kadena network.

The **chainweb-stream** client for browsers and node.js enables you to stream account, module, and event transactions, including their confirmation depth.

The [chainweb-stream][1] client introduces and normalizes the following features across environments:

- Reconnect with exponential backoff
- Initial connection timeout
- Stale connection detection
- Transaction confirmation status classification (unconfirmed/confirmed)
- Server/client configuration compatibility checks

## Status

Alpha version / unstable.

## Installation

### With npm

```sh
npm install @kadena/chainweb-stream-client
```

### With yarn

```sh
yarn add @kadena/chainweb-stream-client
```

## Usage

```js
import { ChainwebStreamClient } from '@kadena/chainweb-stream-client';

const client = new ChainwebStreamClient({
  network: 'mainnet01',
  type: 'event',
  id: 'coin',
  host: 'http://localhost:4000/',
});

client.on('confirmed', (txn) => console.log('confirmed', txn));

client.connect();
```

Find more detailed examples under `src/examples`.

## Constructor options

| Key               | Required | Description                                                     | Example Values              |
| ----------------- | :------: | --------------------------------------------------------------- | --------------------------- |
| network           |   Yes    | Chainweb network                                                | `mainnet01`/`testnet04`/... |
| type              |   Yes    | Transaction type to stream (event/account)                      | `event`/`account`           |
| id                |   Yes    | Account ID or module/event name                                 | `k:abcdef01234..`           |
| host              |   Yes    | Chainweb-stream backend URL                                     | `http://localhost:4000`     |
| limit             |    No    | Initial data load limit                                         | 100                         |
| connectTimeout    |    No    | Connection timeout in ms                                        | 10_000                      |
| heartbeatTimeout  |    No    | Stale connection timeout in ms                                  | 30_000                      |
| maxReconnects     |    No    | How many reconnections to attempt before giving up              | 5                           |
| confirmationDepth |    No    | How many confirmations for a transaction to be considered final | 6                           |

## Considerations ⚠️

### Ensure configuration compatibility

Make sure that your client and server `confirmationDepth` values are compatible.

If your client `confirmationDepth` is larger than the server's, the `confirmed`
event will never fire. The client will automatically detect this condition, emit
an `error` event and disconnect.

If your client's configured network does not match the server's, the client will
emit an `error` event and disconnect.

If your client `heartbeatTimeout` is smaller than the server heartbeat interval,
the client will automatically adapt its heartbeat timeout to 2500ms larger than
the server value.

### Handle temporary and permanent connection failures

When the connection is interrupted or determined to be stale (no heartbeats
received within the heartbeatTimeout interval), a reconnection attempt will be
made (up to `maxReconnects` times.)

It is recommended to handle the fired [will-reconnect][2] and [error][3] events.

## Events

ChainwebStreamClient is an EventEmitter. You can subscribe to the following
events using `.on('event-name', callback)`.

You can look up named types in `src/types.ts`.

### connect

Emitted when the connection to the backend is first established. Reconnections
to not fire this event, see [reconnect][4] instead.

Callback type: `() => void`

### reconnect

Emitted when a reconnection is established. If a connection is dropped or
intentionally killed (e.g. due to staleness/heartbeat timeout) the client will
attempt reconnections at exponential intervals.

Callback type: `() => void`

### confirmed

Emitted when a confirmed transaction is received from the backend. Confirmation
depends on the CONFIRMATION_DEPTH

Callback type: `(txn: ITransaction) => void`

### unconfirmed

Emitted when an unconfirmed transaction is received from the backend. Multiple
unconfirmed events will be fire for the same transaction, as each time the
backend detects a confirmation depth update, it will send the data again with
the latest confirmation depth.

Hint: You can rely on the `.meta.id` value to de-duplicate the underlying
unconfirmed transactions

Callback type: `(txn: ITransaction) => void`

### heights

Emitted when a `heights` event is received by the server. This carries the
maximum height as seen from stream-server's corresponding chainweb-data. This
event is mostly intended for calculating minheight when reconnecting, but the
event itself is exposed to users in case they have use cases beyond that, such
as detecting a stalled cw-data.

Callback type: `(maxChainwebDataHeight: number) => void`

### data

Emitted when any transaction payload is received (unconfirmd and confirmed.)

See: [unconfirmed][5]

### warn

Emitted when the client encounters a retryable error, such as a stale connection
that will be disconnected and retried.

Callback type: `(message: string) => void`

### error

Emitted when the client encounters a non-retryable error, such as when
connection retries are exhausted.

Callback type: `(message: string) => void`

### will-reconnect

Emitted when the client encounters an error that will be retried, signaling
intent to reconnect.

Callback type:
`({ attempts: number, timeout: number, message: string }) => void`

### debug

Developer event emitted whenever anything significant happens. You can attach a
console log to see what is going on internally if you are encountering
unexpected behaviors.

Callback type: `(dbg: IDebugMsgObject) => void`

[1]: https://github.com/kadena-io/chainweb-stream
[2]: #will-reconnect
[3]: #error
[4]: #reconnect
[5]: #unconfirmed
