import { ChainId } from '@kadena/client';
import { describe, expect, it } from 'vitest';
import { getTransfers, processRedistribute } from '../utils';

describe('processRedistribute', () => {
  it('it calculates required coin redistribute ', () => {
    const chains = [
      {
        balance: '1.0',
        chainId: '1' as const,
        demand: '2.0',
      },
      {
        balance: '2.0',
        chainId: '2' as const,
        demand: '1.0',
      },
      {
        balance: '4.0',
        chainId: '2' as const,
        demand: '3.0',
      },
    ];
    const [list, transfers] = processRedistribute(chains);
    expect(list).toEqual([
      {
        balance: '2.0',
        chainId: '1',
        demand: '2.0',
      },
      {
        balance: '1.0',
        chainId: '2',
        demand: '1.0',
      },
      {
        balance: '4.0',
        chainId: '2',
        demand: '3.0',
      },
    ]);
    expect(transfers).toEqual([
      {
        source: '2',
        target: '1',
        amount: '1.0',
      },
    ]);
  });
});

describe('getTransfers', () => {
  it('it calculates required transactions for doing the transfers ', () => {
    const chains = [
      {
        balance: '1.1',
        chainId: '1' as const,
      },
      {
        balance: '2.0',
        chainId: '2' as const,
      },
      {
        balance: '1',
        chainId: '3' as const,
      },
      {
        balance: '1.6',
        chainId: '4' as const,
      },
    ];
    const receivers = [
      { chainId: '0' as ChainId, amount: '2.0' },
      { chainId: '1' as ChainId, amount: '1.0' },
      { chainId: '2' as ChainId, amount: '1.0' },
      { chainId: '' as const, amount: '1.0' },
    ];

    const transfers = getTransfers(chains, '0.0001', receivers);

    expect(transfers).toEqual([
      {
        source: '2',
        target: '0',
        amount: '0.0001',
      },
      {
        source: '1',
        target: '1',
        amount: '0.0001',
      },
      {
        source: '2',
        target: '2',
        amount: '0.0001',
      },
      {
        source: '4',
        target: '3',
        amount: '0.0001',
      },
    ]);
  });
});
