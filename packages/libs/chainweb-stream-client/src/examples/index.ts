import ChainwebStreamClient, { type ITransaction } from '../';

const client: ChainwebStreamClient = new ChainwebStreamClient({
  // required
  network: 'mainnet01',
  type: 'account',
  id: 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3',
  host: 'http://localhost:4000/',

  // optional
  limit: 0,
  connectTimeout: 15_000,
  // intentionally setting this to a very small value, should sync the server setting
  heartbeatTimeout: 1_000,
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
client.on('warn', (...args) => {
  console.log('[WARN]', ...args);
});

// connection was lost and will be retried; show warning to the user
client.on('will-reconnect', (...args) => {
  console.log('[WILL-RECONNECT]', ...args);
});

// reconnected successfully; hide user warning if still showing
client.on('reconnect', () => {
  console.log('[RECONNECT]');
});

// fatal error, no reconnection attempts will be made
// show error state to user
client.on('error', (...args) => {
  console.error('[ERROR]', ...args);
});

// received transaction with confirmation depth < client.confirmationDepth
client.on('unconfirmed', (newTx: ITransaction) =>
  console.log(
    '[UNCONFIRMED]',
    newTx.meta.id,
    `conf=${newTx.meta.confirmations}`,
  ),
);

// received transaction with confirmation depth >= client.confirmationDepth
client.on('confirmed', (newTx: ITransaction) =>
  console.log('[CONFIRMED]', newTx.meta.id, `conf=${newTx.meta.confirmations}`),
);

client.connect();
