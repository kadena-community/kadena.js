import ChainwebStreamClient, { ITransaction } from '../';

const client: ChainwebStreamClient = new ChainwebStreamClient({
  // required
  type: 'account',
  id: 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3',
  host: 'http://localhost:4000/',

  // optional
  limit: 100,
  connectTimeout: 15_000,
  heartbeatTimeout: 45_000,
  maxReconnects: 5,
  confirmationDepth: 6,
});

// debug callback allows you to log conditionally
client.on('debug', (...args) =>
  console.debug(new Date().toISOString(), '[DEBUG]', ...args),
);

client.on('connect', () => {
  console.log('connect callback');
  // first connection success
  // only fires once per .connect()
});

// connection was lost and will be retried; show warning to the user
client.on('will-reconnect', (...args) => {
  console.log('will-reconnect callback', ...args);
});

// reconnected successfully; hide user warning if still showing
client.on('reconnect', () => {
  console.log('reconnect callback');
});

// fatal error, no reconnection attempts will be made
// show error state to user
client.on('error', (...args) => {
  console.error('error callback', ...args);
});

// received transaction with confirmation depth < client.confirmationDepth
client.on('unconfirmed', (newTx: ITransaction) =>
  console.log(
    'unconfirmed callback',
    newTx.meta.id,
    `conf=${newTx.meta.confirmations}`,
  ),
);

// received transaction with confirmation depth >= client.confirmationDepth
client.on('confirmed', (newTx: ITransaction) =>
  console.log(
    'confirmed callback',
    newTx.meta.id,
    `conf=${newTx.meta.confirmations}`,
  ),
);

client.connect();
