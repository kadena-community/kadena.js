import ChainwebStreamClient, { ITransaction } from '../';

const client: ChainwebStreamClient = new ChainwebStreamClient({
  // required
  network: 'mainnet01',
  type: 'event',
  id: 'coin',
  host: 'http://localhost:4000/',

  // optional
  limit: 0,
  connectTimeout: 15_000,
  heartbeatTimeout: 31_000,
  maxReconnects: 5,
  confirmationDepth: 6,
});

// debug callback allows you to log conditionally
client.on('debug', (...args) => {
  console.debug('[DEBUG]', ...args);
});

// first connection success
// only fires once per .connect()
client.on('connect', () => {
  console.log('[CONNECT]');
});

// connection was lost and will be retried; show warning to the user
client.on('will-reconnect', (...args) => {
  console.log('[WILL-RECONNECT]', ...args);
});

// reconnected successfully; hide user warning if still showing
client.on('reconnect', () => {
  console.log('[RECONNECT]');
});

// connection was lost and will be retried; show warning to the user
client.on('warn', (...args) => {
  console.log('[WARN]', ...args);
});

// fatal error, no reconnection attempts will be made
// show error state to user
client.on('error', (...args) => {
  console.error('[ERROR]', ...args);
});

for (const evt of ['confirmed', 'unconfirmed']) {
  // received transaction with confirmation depth >= client.confirmationDepth
  client.on(evt, (newTx: ITransaction) =>
    console.log(
      `[${evt.toUpperCase()}]`,
      newTx.meta.id,
      `conf=${newTx.meta.confirmations}`,
      `height=${newTx.height}`,
    ),
  );
}

client.connect();
