## Events

ChainwebStreamClient is an EventEmitter. You can subscribe to the following events using `.on('event-name', callback)`.

You can look up named types in `src/types.ts`.

### connect

Emitted when the connection to the backend is first established. Reconnections to not fire this event, see [reconnect](#reconnect) instead.

Callback type: `() => void`

### reconnect

Emitted when a reconnection is established. If a connection is dropped or intentionally killed (e.g. due to staleness/heartbeat timeout) the client will attempt reconnections at exponential intervals.

Callback type: `() => void`

### confirmed

Emitted when a confirmed transaction is received from the backend. Confirmation depends on the CONFIRMATION_DEPTH 

Callback type: `(txn: ITransaction) => void`

### unconfirmed

Emitted when an unconfirmed transaction is received from the backend. Multiple unconfirmed events will be fire for the same transaction, as each time the backend detects a confirmation depth update, it will send the data again with the latest confirmation depth.

Hint: You can rely on the `.meta.id` value to de-duplicate the underlying unconfirmed transactions

Callback type: `(txn: ITransaction) => void`

### data

Emitted when any transaction payload is received (unconfirmd and confirmed.)

See: [unconfirmed](#unconfirmed)

### warn

Emitted when the client encounters a retryable error, such as a stale connection that will be disconnected and retried.

Callback type: `(message: string) => void`

### error

Emitted when the client encounters a non-retryable error, such as when connection retries are exhausted.

Callback type: `(message: string) => void`

### will-reconnect

Emitted when the client encounters an error that will be retried, signaling intent to reconnect.

Currently this is synonymous to the `warn` event.

Callback type: `() => void`

### debug

Developer event emitted whenever anything significant happens. You can attach a console log to see what is going on internally if you are encountering unexpected behaviors.

Callback type: `(dbg: IDebugMsgObject) => void`


