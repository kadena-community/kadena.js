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
    const [list, transfers] = processRedistribute(chains, '0.0001');

    expect(list).toEqual([
      { balance: '2.0001', chainId: '1', demand: '2.0' },
      { balance: '1.0', chainId: '2', demand: '1.0' },
      { balance: '3.9997', chainId: '2', demand: '3.0' },
    ]);
    expect(transfers).toEqual([
      { source: '2', target: '1', amount: '0.9999' },
      { source: '2', target: '1', amount: '0.0002' },
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
      [
        {
          chainId: '0',
          amount: '2.0',
          index: 0,
          type: 'fixed',
          chunks: [{ chainId: '0', amount: '2.0' }],
        },
        {
          chainId: '1',
          amount: '1.0',
          index: 1,
          type: 'fixed',
          chunks: [{ chainId: '1', amount: '1.0' }],
        },
        {
          chainId: '2',
          amount: '1.0',
          index: 2,
          type: 'fixed',
          chunks: [{ chainId: '2', amount: '1.0' }],
        },
        {
          chainId: '',
          amount: '1.0',
          index: 3,
          type: 'auto',
          chunks: [
            { chainId: '2', amount: '0.9998' },
            { chainId: '3', amount: '0.0002' },
          ],
        },
      ],
      [
        { source: '4', target: '0', amount: '1.5999' },
        { source: '3', target: '0', amount: '0.4003' },
      ],
    ]);
  });
});
