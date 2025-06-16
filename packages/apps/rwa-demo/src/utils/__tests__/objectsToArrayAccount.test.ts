import type { KeysetGuard } from '@/providers/AccountProvider/AccountType';
import { describe, expect, it } from 'vitest';
import { objectsToArrayAccount } from '../objectsToArrayAccount';

describe('objectsToArrayAccount', () => {
  it('should convert object properties to arrays for chains, guard.keys, and keyset.keys', () => {
    const input = {
      address: 'k:abc',
      publicKey: 'abc',
      guard: {
        keys: { a: 'key1', b: 'key2' },
        pred: 'keys-all',
      },
      keyset: {
        keys: { a: 'key1', b: 'key2' },
        pred: 'keys-all',
      },
      alias: 'alias',
      contract: 'contract',
      chains: {
        '0': { chainId: '0', balance: '100' },
        '1': { chainId: '1', balance: '200' },
      },
      overallBalance: '300',
      walletName: 'web',
    };
    const result = objectsToArrayAccount(input);
    expect(Array.isArray(result.chains)).toBe(true);
    expect(result.chains).toEqual([
      { chainId: '0', balance: '100' },
      { chainId: '1', balance: '200' },
    ]);
    // Guard and keyset should be KeysetGuard
    expect('keys' in result.guard).toBe(true);
    expect(Array.isArray((result.guard as KeysetGuard).keys)).toBe(true);
    expect((result.guard as KeysetGuard).keys).toEqual(['key1', 'key2']);
    expect('keys' in result.keyset).toBe(true);
    expect(Array.isArray((result.keyset as KeysetGuard).keys)).toBe(true);
    expect((result.keyset as KeysetGuard).keys).toEqual(['key1', 'key2']);
  });

  it('should handle missing chains, guard, or keyset gracefully', () => {
    const input = {
      address: 'k:abc',
      publicKey: 'abc',
      alias: 'alias',
      contract: 'contract',
      overallBalance: '0',
      walletName: 'web',
    };
    const result = objectsToArrayAccount(input);
    expect(result.chains).toEqual([]);
    expect('keys' in result.guard).toBe(true);
    expect((result.guard as KeysetGuard).keys).toEqual([]);
    expect('keys' in result.keyset).toBe(true);
    expect((result.keyset as KeysetGuard).keys).toEqual([]);
  });
});
