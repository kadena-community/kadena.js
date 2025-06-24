import { base64UrlDecode } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

export const MINIMUM_GAS_PRICE = 1e-8;

export const MAX_BLOCK_CAPACITY = 150000;

export const median = (sortedArray: number[]): number => {
  if (sortedArray.length === 0) {
    return 0;
  }
  if (sortedArray.length % 2 === 1) {
    return sortedArray[Math.floor(sortedArray.length / 2)];
  } else {
    return new PactNumber(sortedArray[sortedArray.length / 2 - 1])
      .plus(sortedArray[sortedArray.length / 2])
      .dividedBy(2)
      .toNumber();
  }
};

export const average = (arr: number[]): number => {
  if (arr.length === 0) {
    return 0;
  }
  return arr
    .reduce((acc, gasFee) => acc.plus(gasFee), new PactNumber(0))
    .dividedBy(arr.length)
    .toNumber();
};

/**
 * Interface representing the subset of structure of the block data returned from the Chainweb API
 * this is not the full structure of the block data, but only the relevant parts for calculating gas fees.
 */
export interface IBlockChainData {
  items: Array<{
    header: {
      height: number;
    };
    payloadWithOutputs: { transactions: Array<[string, string]> };
  }>;
}

/**
 * Interface representing the gas information for a block.
 * This includes the total gas consumed, total gas limit, total gas paid, transaction count,
 * block gas used percentage, and gas price statistics (min, max, avg, median).
 * @public
 */
export interface IBlockGasInformation {
  blockHeight: number;
  totalGasConsumed: number; // sum of all gas consumed in the block transactions extracted from gas field of tx result
  totalGasLimit: number; // sum of all gas limits in the block transactions extracted from gasLimit field of tx command
  totalGasPaid: number; // sum of all gasPrice * gasLimit in the block transactions extracted from meta field of tx command
  txCount: number; // number of transactions in the block
  blockGasUsedPercent: number; // percentage of gas used in the block (totalGasConsumed / MAX_BLOCK_CAPACITY)
  gasPriceStats: {
    min: number; // minimum gas price in the block transactions
    max: number; // maximum gas price in the block transactions
    avg: number; // average gas price in the block transactions (does not consider usage)
    median: number; // median gas price in the block transactions
  };
}

/**
 * Calculates gas information for a given set of blocks.
 * @param blocks - An object containing block information.
 * @returns An array of gas information for each block.
 */
export function calculateGasInformation(
  blocks: IBlockChainData,
  { maxBlockCapacity = MAX_BLOCK_CAPACITY } = {},
) {
  const gasData = blocks.items.map((block) => {
    const txData = block.payloadWithOutputs.transactions.map(
      ([payload, result]) => {
        try {
          const tx = JSON.parse(base64UrlDecode(payload));
          const command = JSON.parse(tx.cmd);
          const gasConsumed = JSON.parse(base64UrlDecode(result)).gas;
          return {
            hash: tx.hash,
            gasPrice: command.meta.gasPrice,
            gasLimit: command.meta.gasLimit,
            consumedGas: gasConsumed ?? command.meta.gasLimit,
            gasPaid: command.meta.gasPrice * gasConsumed,
          };
        } catch (e) {
          console.error('Error parsing transaction data:', e);
          return {
            hash: 'N/A',
            gasPrice: 0,
            gasLimit: 0,
            consumedGas: 0,
            gasPaid: 0,
          };
        }
      },
    );

    const totalGasConsumed = txData.reduce((acc, tx) => {
      return acc + tx.consumedGas;
    }, 0);

    const totalGasLimit = txData.reduce((acc, tx) => {
      return acc + tx.gasLimit;
    }, 0);

    const totalGasPaid = txData.reduce((acc, tx) => {
      return acc + tx.gasPaid;
    }, 0);

    const txGasPrice = txData
      .map((tx: { gasPrice: number }) => tx.gasPrice)
      .sort((a, b) => a - b);
    const minGasPrice = txGasPrice[0] ?? 0;
    const maxGasPrice = txGasPrice[txGasPrice.length - 1] ?? 0;

    const gasInformation: IBlockGasInformation = {
      blockHeight: block.header.height,
      totalGasConsumed,
      totalGasLimit,
      totalGasPaid,
      txCount: txData.length,
      blockGasUsedPercent: (totalGasConsumed * 100) / maxBlockCapacity,
      gasPriceStats: {
        min: minGasPrice,
        max: maxGasPrice,
        avg: average(txGasPrice),
        median: median(txGasPrice),
      },
    };
    return gasInformation;
  });

  const sorted = gasData.sort((a, b) => b.blockHeight - a.blockHeight);

  return sorted;
}

/**
 * Calculates the gas price based on the provided gas data.
 * @param gasData - An array of gas data for each block.
 * @param considerCongestion - A boolean indicating whether to consider usage in the calculation.
 * @returns The estimated gas price.
 * @example
 * const estimatedGasPrice = calculateGasPrice(gasData);
 * console.log('Estimated gas price:', estimatedGasPrice);
 * // Output: Estimated gas price: 0.00000001
 */
export function calculateGasPrice(
  gasData: Array<{
    txCount: number;
    gasPriceStats: { min: number };
  }>,
) {
  const mins = gasData
    .filter((b) => b.txCount > 0)
    .map((data) => data.gasPriceStats.min)
    .sort((a, b) => a - b);

  const estimate = median(mins);

  return Math.max(estimate ?? 0, MINIMUM_GAS_PRICE);
}
