import { describe, expect, it } from 'vitest';
import { estimateGasPrice, getBlocksGasInformation } from '../core';
import { MINIMUM_GAS_PRICE } from '../core/estimateGasPrice/utils';

describe('estimateGasPrice', () => {
  it('fetch and returns gas price for specific height', async () => {
    const gasPrice = await estimateGasPrice({
      networkId: 'testnet04',
      chainId: '0',
      height: 5000000,
    });

    expect(gasPrice).toBe(MINIMUM_GAS_PRICE);
  });

  it('fetch and returns gas price for latest height', async () => {
    const gasPrice = await estimateGasPrice({
      networkId: 'testnet04',
      chainId: '0',
    });

    expect(gasPrice).toBeGreaterThan(0);
  });
});

describe('getBlocksGasInformation', async () => {
  it('fetch and returns gas information for specific height', async () => {
    const gasInformation = await getBlocksGasInformation({
      networkId: 'testnet04',
      chainId: '0',
      height: 5300000,
    });

    const [firstBlock] = gasInformation;

    console.log('gasInformation', firstBlock);

    expect(firstBlock).toStrictEqual({
      blockHeight: 5300000,
      totalGasConsumed: 0,
      totalGasLimit: 0,
      totalGasPaid: 0,
      txCount: 0,
      blockGasUsedPercent: 0,
      gasPriceStats: { min: 0, max: 0, avg: 0, median: 0 },
    });
  });
  it('fetch and returns gas information for latest height', async () => {
    const gasInformation = await getBlocksGasInformation({
      networkId: 'testnet04',
      chainId: '0',
    });

    const [firstBlock] = gasInformation;

    expect(firstBlock.blockHeight).toBeGreaterThan(5300000);
  });
});
