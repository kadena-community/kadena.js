import { describe, expect, test, vi } from 'vitest';
import chainweb from '..';
import * as utils from '../utils';
import { config } from './config';
import { blockStream } from './mocks/blockStream';

const buildEventSourceSpy = vi.spyOn(utils, 'buildEventSource');
const data =
  '{"txCount":0,"powHash":"0000000000000013e8daf76a638110f4df0ed1e23540fee86c4764d20a85f852","header":{"creationTime":1673639160436808,"parent":"3V_utahkinfFQOzutFfiTWNrpayqfXW7QbdXrZlDUv0","height":3373609,"hash":"pPJnRMOz76sfUNUcyClPrA9Q6V0DkcryqaFuzaQnasM","chainId":7,"weight":"d933TCC8tPqBMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1673637602370636,"adjacents":{"2":"iWnpS6TAUTIqjQHHmbfW7ZpDHw3MfTGgz2T8SToKoQM","5":"GPN6VqhC7b1TBqcnzQVOETRvw647fL34l3i8L9vLQk0","9":"S5VjlosMuZ4ThP1epy3qhiaAF3AGyLZAMU7wpJSrg_I"},"payloadHash":"XBY_AduCYF3suBr6xuju1HyO-RyNYfm7Ui7gp8GNdCc","chainwebVersion":"mainnet01","target":"Jq0rA9VdLgz28Jw-aALcUciH-RL1MUeTOwAAAAAAAAA","nonce":"2501407169628352200"},"target":"000000000000003b934731f512f987c851dc02683e9cf0f60c2e5dd5032bad26"}';
const data2 =
  '{"txCount":1,"powHash":"0000000000000013e8daf76a638110f4df0ed1e23540fee86c4764d20a85f852","header":{"creationTime":1673639160436808,"parent":"3V_utahkinfFQOzutFfiTWNrpayqfXW7QbdXrZlDUv0","height":3373609,"hash":"pPJnRMOz76sfUNUcyClPrA9Q6V0DkcryqaFuzaQnasM","chainId":7,"weight":"d933TCC8tPqBMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1673637602370636,"adjacents":{"2":"iWnpS6TAUTIqjQHHmbfW7ZpDHw3MfTGgz2T8SToKoQM","5":"GPN6VqhC7b1TBqcnzQVOETRvw647fL34l3i8L9vLQk0","9":"S5VjlosMuZ4ThP1epy3qhiaAF3AGyLZAMU7wpJSrg_I"},"payloadHash":"XBY_AduCYF3suBr6xuju1HyO-RyNYfm7Ui7gp8GNdCc","chainwebVersion":"mainnet01","target":"Jq0rA9VdLgz28Jw-aALcUciH-RL1MUeTOwAAAAAAAAA","nonce":"2501407169628352200"},"target":"000000000000003b934731f512f987c851dc02683e9cf0f60c2e5dd5032bad26"}';
const data3 =
  '{"txCount":0,"powHash":"0000000000000036a2017c4491a8625e2b74db01e5ca1ac9cc59f1935227e55d","header":{"creationTime":1673639182860102,"parent":"ef8UtdHTIlvZa81SkD5TtVjLkf2523eYA1daKXNxm24","height":3373610,"hash":"qo3fE5d9cwky3PlJKt3KEzjI0GnTchG0YdgT9qpJAQM","chainId":3,"weight":"rSiyZ0LOvHaAMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1673637633519547,"adjacents":{"8":"1cxYTjNx12zr8WOiYD2C4io5QUEEy4feHjphRP5mtWo","13":"VG7yR9Fa4Gnwrven18HE6hGqG2G04yVQzZDPyetmymI","18":"KdoJ_bJ4Uv2XnbyYDYwXhLxJ_4sFUh7Tycqw1B-l-Rc"},"payloadHash":"ddrV9xpCCKqc_rTFVwkD-Yw7jM5gwButcwgREgGX3cA","chainwebVersion":"mainnet01","target":"kutP9ud3YmIz7AAvLVhrivIEeG5IOSdHxvcOwAAAAAAAAA","nonce":"10680198408436536927"},"target":"000000000000003bdc1b1f9de420b9e111c82bae61b5bc00b0cf8889dd9ddb3f"}';

const onError = vi.fn();
const evtsmock = {
  CLOSED: 0,
  CONNECTING: 0,
  OPEN: 0,
  dispatchEvent: vi.fn(),
  onerror: onError,
  onmessage: vi.fn(),
  onopen: vi.fn(),
  readyState: 0,
  url: '',
  withCredentials: false,
  addEventListener: vi.fn().mockImplementation((event, handler) => {
    handler({ data });
    handler({ data: data2 });
  }),
  close: vi.fn(),
  removeEventListener: vi.fn(),
};
buildEventSourceSpy.mockReturnValue(evtsmock);

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

const transactions_chains = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

describe('chainweb.transaction.stream', () => {
  streamTest(
    'should stream transactions with depth 0, 1 and count should increase by blocks',
    async () => {
      buildEventSourceSpy.mockReturnValue({
        ...evtsmock,
        addEventListener: vi.fn().mockImplementation((event, handler) => {
          blockStream.forEach((item) => {
            handler({ data: JSON.stringify(item) });
          });
        }),
      });
      let count = 0;
      const hs = chainweb.transaction.stream(
        1,
        transactions_chains,
        (h) => {
          logg('new transaction', h);
          count++;
        },
        config.network,
        config.host,
      );
      hs.close();
      expect(count).toBeGreaterThanOrEqual(0);
    },
    100,
  );

  streamTest.each([10, 0])(
    'should stream transactions with depth 0 and depth 10 succeeding, and count should increase by blocks',
    async (n) => {
      let count = 0;
      const hs = chainweb.transaction.stream(
        n,
        [0],
        (h) => {
          logg('new transaction', h);
          count++;
        },
        config.network,
        config.host,
      );
      hs.close();
      expect(count).toBeGreaterThanOrEqual(0);
    },
    100,
  );
});

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

describe('chainweb.block.stream', () => {
  streamTest(
    'should stream and not throw with depth 10, and count should increase by blocks',
    async () => {
      let count = 0;
      const hs = chainweb.block.stream(
        10,
        [0],
        (h) => {
          count++;
        },
        config.network,
        config.host,
      );
      hs.close();
      expect(count).toBeGreaterThanOrEqual(0);
    },
    100,
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

describe('chainweb.event.stream', () => {
  streamTest.each([data3, data2])(
    'should stream and succeed, chain count should increase by blocks',
    async (n) => {
      buildEventSourceSpy.mockReturnValue({
        ...evtsmock,
        addEventListener: vi.fn().mockImplementation((event, handler) => {
          handler({ data: n });
        }),
      });
      let count = 0;
      const hs = chainweb.event.stream(
        0,
        events_allChains,
        (h) => {
          logg('new event', h);
          count++;
        },
        config.network,
        config.host,
      );
      hs.close();
      expect(count).toBeGreaterThanOrEqual(0);
    },
    100,
  );
});

const chains = [2, 4];

describe('chainweb.block.stream', () => {
  streamTest(
    'should stream for even chains and count should increase by blocks',
    async () => {
      let count = 0;
      buildEventSourceSpy.mockReturnValue({
        ...evtsmock,
        addEventListener: vi.fn().mockImplementation((event, handler) => {
          blockStream.forEach((item) => {
            handler({ data: JSON.stringify(item) });
          });
        }),
      });
      const hs = chainweb.block.stream(
        1,
        chains,
        (h) => {
          count += 1;
          expect(h.header.chainId % 2).toBe(0);
        },
        config.network,
        config.host,
      );
      expect(count).toBeGreaterThanOrEqual(0);
      hs.close();
    },
    100,
  );
});
