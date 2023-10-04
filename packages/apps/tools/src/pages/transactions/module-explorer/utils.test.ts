import { CHAINS } from '@kadena/chainweb-node-client';

import { getCookieValue, getQueryValue } from './utils';

import type { ParsedUrlQuery } from 'querystring';

const exampleCookies: string = `_persist%3AdevOption=%2522BASIC%2522; _persist%3Anetwork=%2522testnet04%2522; _persist%3AchainID=%25221%2522`;
const exampleQuery: ParsedUrlQuery = {
  module: 'ab2288bca-3d56-4da0-b363-0df378b9956d.ns-module',
  chain: '0',
};

describe('getQueryValue', () => {
  it('should return undefined if the needle is not in the haystack', () => {
    expect(getQueryValue('needle', {})).toBeUndefined();
  });

  it('should be able to get an existing value from the query', () => {
    expect(getQueryValue('module', exampleQuery)).toBe(
      'ab2288bca-3d56-4da0-b363-0df378b9956d.ns-module',
    );
    expect(getQueryValue('chain', exampleQuery)).toBe('0');
  });

  it('should not be able to get an existing value from the query if the validator fails', () => {
    expect(getQueryValue('module', exampleQuery, () => false)).toBeUndefined();

    expect(getQueryValue('chain', { chain: '1337' })).toBe('1337');

    expect(
      getQueryValue('chain', { chain: '1337' }, (value) =>
        CHAINS.includes(value),
      ),
    ).toBeUndefined();
  });
});

describe('getCookieValue', () => {
  it('should return null if the needle is not in the haystack', () => {
    expect(getCookieValue('needle', '')).toBeNull();
  });

  it('should return the default value if the needle is not in the haystack', () => {
    expect(getCookieValue('needle', '', 'my default value')).toBe(
      'my default value',
    );
  });

  it('should be able to get an existing value from the cookies', () => {
    expect(getCookieValue('chainID', exampleCookies)).not.toBe('%221%22');
    expect(getCookieValue('chainID', exampleCookies)).toBe('1');

    expect(getCookieValue('network', exampleCookies)).toBe('testnet04');
  });
});
