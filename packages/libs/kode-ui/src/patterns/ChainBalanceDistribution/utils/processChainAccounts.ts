import type { IChainBalanceProps } from '../types';

export const calculateMaxChainBalance = (
  chains: IChainBalanceProps[],
): number => {
  return chains.reduce((acc: number, val) => {
    if (typeof val === 'string') return acc;
    const balance = val.balance ?? 0;
    return balance > acc ? balance : acc;
  }, 0);
};

/**
 * Checks the percentage of the chainbalance to the maxValue.
 * maxValue is always 100%
 * the minvalue to show (when there is a balance) is the THRESHOLD
 */

const THRESHOLD = 2;
export const chainBalancePercentage = (
  balance: number,
  maxValue: number,
): number => {
  if (!balance) return 0;
  const percentage = (balance / maxValue) * 100;
  return percentage < THRESHOLD ? THRESHOLD : percentage;
};

/**
 * creates an array of all the available chains.
 * and adds the balance values of the IChainAccounts in the correct place
 */
export const divideChains = (
  chains: IChainBalanceProps[],
  listCount: number,
): IChainBalanceProps[][] => {
  const result: IChainBalanceProps[][] = [];
  const totalLength = chains.length;
  const baseSize = Math.floor(totalLength / listCount);
  const extraItems = totalLength % listCount;

  let startIndex = 0;

  for (let i = 0; i < listCount; i++) {
    const currentSize = baseSize + (i < extraItems ? 1 : 0);
    result.push(chains.slice(startIndex, startIndex + currentSize));
    startIndex += currentSize;
  }

  return result;
};
