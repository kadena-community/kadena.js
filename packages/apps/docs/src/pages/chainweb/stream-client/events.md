---
title: Events
description: Kadena makes blockchain work for everyone.
menu: Events
label: Events
order: 5
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-stream-client/README.md
layout: full
tags: [chainweb,stream,reference]
lastModifiedDate: Wed, 02 Aug 2023 07:22:41 GMT
---
# Events

ChainwebStreamClient is an EventEmitter. You can subscribe to the following
events using `.on('event-name', callback)`.

You can look up named types in `src/types.ts`.

### connect

Emitted when the connection to the backend is first established. Reconnections
to not fire this event, see [reconnect ](/chainweb/stream-client/events#reconnect) instead.

Callback type: `() => void`

### reconnect

Emitted when a reconnection is established. If a connection is dropped or
intentionally killed (e.g. due to staleness/heartbeat timeout) the client will
attempt reconnections at exponential intervals.

Callback type: `() => void`

### confirmed

Emitted when a confirmed transaction is received from the backend. Confirmation
depends on the CONFIRMATION\_DEPTH

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

See: [unconfirmed ](/chainweb/stream-client/events#unconfirmed)

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
