import type { IChainBalanceProps } from '@kadena/kode-ui/patterns';

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

export const processChainAccounts = (
  chains: IChainBalanceProps[],
  chainCount: number,
): IChainBalanceProps[] => {
  const maxChainBalance = calculateMaxChainBalance(chains);

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
      percentage: chainBalancePercentage(chain?.balance ?? 0, maxChainBalance),
    } as IChainBalanceProps;
  });
};
