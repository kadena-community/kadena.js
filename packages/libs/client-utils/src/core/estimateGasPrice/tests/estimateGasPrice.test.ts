import { base64UrlEncode } from '@kadena/cryptography-utils';
import { describe, expect, it } from 'vitest';
import {
  calculateGasInformation,
  calculateGasPrice,
  MINIMUM_GAS_PRICE,
} from '../utils';

const base64 = (object: Record<string, unknown>): string => {
  return base64UrlEncode(JSON.stringify(object));
};

describe('calculateGasInformation', () => {
  it('summarizes block data to gas information', async () => {
    const blocks = {
      items: [
        {
          header: {
            height: 1,
          },
          payloadWithOutputs: {
            transactions: [
              [
                base64({
                  hash: 'test-hash-1',
                  cmd: JSON.stringify({
                    meta: { gasPrice: 0.1, gasLimit: 10 },
                  }),
                }),
                base64({ gas: 8 }),
              ],
              [
                base64({
                  hash: 'test-hash-2',
                  cmd: JSON.stringify({
                    meta: { gasPrice: 0.2, gasLimit: 5 },
                  }),
                }),
                base64({ gas: 4 }),
              ],
            ] satisfies [string, string][],
          },
        },
      ],
    };
    const gasInfo = calculateGasInformation(blocks, {
      maxBlockCapacity: 24,
    });

    expect(gasInfo).toEqual([
      {
        blockHeight: 1,
        totalGasConsumed: 12,
        totalGasLimit: 15,
        totalGasPaid: 1.6,
        txCount: 2,
        blockGasUsedPercent: 50,
        gasPriceStats: {
          min: 0.1,
          max: 0.2,
          avg: 0.15,
          median: 0.15,
        },
      },
    ]);
  });
});

describe('calculateGasPrice', () => {
  it('returns median of mins', () => {
    const gasData = [
      {
        txCount: 3,
        gasPriceStats: {
          min: 0.1,
        },
      },
      {
        txCount: 2,
        gasPriceStats: {
          min: 0.3,
        },
      },
    ];

    const gasPrice = calculateGasPrice(gasData);

    expect(gasPrice).toEqual(0.2);
  });
  it('returns median of mins', () => {
    const gasData = [
      {
        txCount: 3,
        gasPriceStats: {
          min: 0.1,
        },
      },
      {
        txCount: 2,
        gasPriceStats: {
          min: 0.3,
        },
      },
      {
        txCount: 2,
        gasPriceStats: {
          min: 0.21,
        },
      },
    ];

    const gasPrice = calculateGasPrice(gasData);

    expect(gasPrice).toEqual(0.21);
  });

  it('discards empty blocks', () => {
    const gasData = [
      {
        txCount: 3,
        gasPriceStats: {
          min: 0.1,
        },
      },
      {
        txCount: 0,
        gasPriceStats: {
          min: 0,
        },
      },
      {
        txCount: 2,
        gasPriceStats: {
          min: 0.3,
        },
      },
    ];

    const gasPrice = calculateGasPrice(gasData);

    expect(gasPrice).toEqual(0.2);
  });

  it('returns min gas price if all blocks empty', () => {
    const gasData = [
      {
        txCount: 0,
        gasPriceStats: {
          min: 0,
        },
      },
      {
        txCount: 0,
        gasPriceStats: {
          min: 0,
        },
      },
    ];

    const gasPrice = calculateGasPrice(gasData);

    expect(gasPrice).toEqual(MINIMUM_GAS_PRICE);
  });
});
