import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';

/**
 * Checks the percentage of the chainbalance to the maxValue.
 * maxValue is always 100%
 * the minvalue to show (when there is a balance) is the THRESHOLD
 */

const THRESHOLD = 2;
export const chainBalancePercentage = (
  chain: IChainAccounts[0],
  maxValue: number,
): number => {
  if (typeof chain === 'string') return 0;
  const percentage = (chain.balance / maxValue) * 100;
  return percentage < THRESHOLD ? THRESHOLD : percentage;
};
