jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import fetch from 'cross-fetch';
import chainweb from '..';
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
/* Cuts */

describe('chainweb.cut', () => {
  /* ************************************************************************** */
  /* By Peers */

  it('gets p2p cuts of network and validates', async () => {
    const r = await chainweb.cut.peers(
      'mainnet01',
      'https://us-e1.chainweb.com',
    );
    logg('Cut Peers:', r);
    expect(r).toBeTruthy();
    expect(r.length).toBeGreaterThan(0);
  });

  /* ************************************************************************** */
  /* By Current */

  it('gets current cut from chainweb node', async () => {
    const r = await chainweb.cut.current(
      'mainnet01',
      'https://api.chainweb.com',
    );
    logg('Current Cut:', r);
    expect(r).toBeTruthy();
    expect(r).toHaveProperty('instance');
    expect(r).toHaveProperty('height');
    expect(r).toHaveProperty('weight');
    expect(r).toHaveProperty('hashes');
    expect(Object.keys(r.hashes).length).toBe(20);
    expect(r.instance).toBe('mainnet01');
    expect(r.height).toBeGreaterThan(30000000);
    expect(r.hashes[0].height).toBeGreaterThan(1800000);
  });
});
