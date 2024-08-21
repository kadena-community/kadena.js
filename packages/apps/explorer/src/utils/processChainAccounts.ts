import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';

export interface IViewChain {
  chainId: string;
  percentage?: number;
  balance?: number;
}

export const calculateMaxChainBalance = (chains: IChainAccounts): number => {
  return chains.reduce((acc: number, val) => {
    if (typeof val === 'string') return acc;
    return val.balance > acc ? val.balance : acc;
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

export const processChainAccounts = (
  chains: IChainAccounts,
  chainCount: number,
): IViewChain[] => {
  const maxChainBalance = calculateMaxChainBalance(chains);

  return Array.from(Array(chainCount).keys()).map((idx) => {
    const chain = chains.find((c) => {
      return typeof c !== 'string' && c?.chainId === `${idx}`;
    });

    if (!chain || typeof chain === 'string') {
      return {
        chainId: `${idx}`,
      } as IViewChain;
    }
    return {
      chainId: chain?.chainId,
      balance: chain?.balance,
      percentage: chainBalancePercentage(chain?.balance ?? 0, maxChainBalance),
    } as IViewChain;
  });
};

/**
 * creates an array of all the available chains.
 * and adds the balance values of the IChainAccounts in the correct place
 */
export const divideChains = (
  chains: IViewChain[],
  listCount: number,
): IViewChain[][] => {
  const result: IViewChain[][] = [];
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
