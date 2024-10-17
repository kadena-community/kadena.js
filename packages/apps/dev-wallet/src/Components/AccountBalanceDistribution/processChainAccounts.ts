import { ChainId } from '@kadena/client';
import { IChainBalanceProps } from '@kadena/kode-ui/patterns';

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
  chains: Array<{
    chainId: ChainId;
    balance?: number;
  }>,
  chainCount: number,
  overallBalance: number,
): IChainBalanceProps[] => {
  return Array.from(Array(chainCount).keys()).map((idx) => {
    const chain = chains.find((c) => {
      return typeof c !== 'string' && c?.chainId === `${idx}`;
    });

    if (!chain || typeof chain === 'string') {
      return {
        chainId: `${idx}`,
      } as IChainBalanceProps;
    }

    return {
      chainId: chain?.chainId,
      balance: chain?.balance,
      percentage: chainBalancePercentage(chain?.balance ?? 0, overallBalance),
    } as IChainBalanceProps;
  });
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
