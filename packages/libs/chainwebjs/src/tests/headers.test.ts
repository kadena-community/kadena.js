jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import fetch from 'cross-fetch';
import chainweb from '..';
import { config } from './config';
import { header } from './mocks/header';
import { mockFetch } from './mokker';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);
/* ************************************************************************** */
/* Test settings */

jest.setTimeout(25000);
const debug: boolean = false;

/* ************************************************************************** */
/* Test Utils */

const logg = (...args: unknown[]): void => {
  if (debug) {
    console.log(...args);
  }
};

/* ************************************************************************** */
/* Headers */

const height = 1511601;

/* ************************************************************************** */
/* By Height */

describe('chainweb.header', () => {
  it('should return the correct header by height', async () => {
    const r = await chainweb.header.height(
      0,
      height,
      config.network,
      config.host,
    );
    logg('Headers:', r);
    expect(r).toEqual(header);
  });
});
