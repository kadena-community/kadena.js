import chainweb from '..';
/* ************************************************************************** */
/* Test settings */

jest.setTimeout(25000);
const debug: boolean = false;
const streamTest = test.concurrent;

/* ************************************************************************** */
/* Test Utils */

const logg = (...args: unknown[]): void => {
  if (debug) {
    console.log(...args);
  }
};

/* ************************************************************************** */
/* Block Stream */

/* Streams are backed by EventSource clients that retrieve header update
 * events from the Chainweb API.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * The functions buffer, filter, and transform the original events and
 * generate a stream of derived items to which a callback is applied.
 *
 * The functions also return the underlying EventSource object, for more
 * advanced low-level control.
 */

const sleep = (ms: number | undefined): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

const chains = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

describe('stream', () => {
  streamTest(
    'Block',
    async () => {
      let count = 0;
      const hs = chainweb.block.stream(1, chains, (h) => {
        logg('new block', h);
        expect(h.header.chainId % 2).toBe(0);
        count++;
      });
      logg('block stream started');
      await sleep(60000);
      hs.close();
      logg('block stream closed');
      expect(count).toBeGreaterThan(4);
    },
    61000,
  );
});

/* ************************************************************************** */
/* Event Stream */

/* Streams are backed by EventSource clients that retrieve header update
 * events from the Chainweb API.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * The functions buffer, filter, and transform the original events and
 * generate a stream of derived items to which a callback is applied.
 *
 * The functions also return the underlying EventSource object, for more
 * advanced low-level control.
 */

const events_allChains = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

describe('stream', () => {
  streamTest(
    'Events',
    async () => {
      let count = 0;
      const hs = chainweb.event.stream(-1, events_allChains, (h) => {
        logg('new event', h);
        count++;
      });
      logg('event stream started');
      await sleep(60000);
      hs.close();
      logg('event stream closed');
      expect(count).toBeGreaterThanOrEqual(0);
    },
    61000,
  );
});

/* ************************************************************************** */
/* Transaction Stream */

/* Streams are backed by EventSource clients that retrieve header update
 * events from the Chainweb API.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * The functions buffer, filter, and transform the original events and
 * generate a stream of derived items to which a callback is applied.
 *
 * The functions also return the underlying EventSource object, for more
 * advanced low-level control.
 */

const transactions_allChains = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

describe('stream', () => {
  streamTest(
    'Transactions',
    async () => {
      let count = 0;
      const hs = chainweb.transaction.stream(1, transactions_allChains, (h) => {
        logg('new transaction', h);
        count++;
      });
      logg('transaction stream started');
      await sleep(60000);
      hs.close();
      logg('transaction stream closed');
      expect(count).toBeGreaterThanOrEqual(0);
    },
    61000,
  );
});
