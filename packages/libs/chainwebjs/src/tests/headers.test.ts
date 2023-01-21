jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { header } from './mocks/header';
import { mockFetch } from './mokker';

import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

import chainweb from '..';

import { config } from './config';
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
