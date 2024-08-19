import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';

export const fillChains = (
  chains: IChainAccounts,
  chainCount: number,
): {
  chains1: IChainAccounts;
  chains2: IChainAccounts;
  maxValue: number;
} => {
  const completeArray = Array.from(Array(chainCount).keys()).map((idx) => {
    const chain = chains.find(
      (c) => typeof c !== 'string' && c?.chainId === `${idx}`,
    );
    return chain ? chain : `${idx}`;
  });

  const half = Math.ceil(completeArray.length / 2);
  return {
    chains1: completeArray.slice(0, half),
    chains2: completeArray.slice(half),
    maxValue: completeArray.reduce((acc: number, val) => {
      if (typeof val === 'string') return acc;
      return val.balance > acc ? val.balance : acc;
    }, 0),
  };
};
