import { describe, expect, it } from 'vitest';
import { extractNetworkAndChain } from '../utils';

describe('extractNetworkAndChain', () => {
  it('should return an empty object when api is undefined', () => {
    const result = extractNetworkAndChain(undefined);
    expect(result).toEqual({});
  });

  it('should extract the network and chain from the api string', () => {
    const api = '/chainweb/0.0/mainnet01/';
    const result = extractNetworkAndChain(api);
    expect(result).toEqual({ network: 'mainnet01', chain: undefined });
  });

  it('should return undefined for network and chain when api string does not match the pattern', () => {
    const api = '/chainweb/0.0/';
    const result = extractNetworkAndChain(api);
    expect(result).toEqual({ network: undefined, chain: undefined });
  });

  it('should parse the chain number correctly when api string contains a different chain', () => {
    const api = 'http://api.com/chainweb/0.0/testnet04/chain/2/pact';
    const result = extractNetworkAndChain(api);
    expect(result).toEqual({ network: 'testnet04', chain: 2 });
  });
});
