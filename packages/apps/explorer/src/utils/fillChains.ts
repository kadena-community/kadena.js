import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';

/**
 * creates an array of all the available chains.
 * and adds the balance values of the IChainAccounts in the correct place
 */
export const fillChains = (
  chains: IChainAccounts,
  chainCount: number,
): IChainAccounts => {
  return Array.from(Array(chainCount).keys()).map((idx) => {
    const chain = chains.find(
      (c) => typeof c !== 'string' && c?.chainId === `${idx}`,
    );
    return chain ? chain : `${idx}`;
  });
};

/**
 * creates an array of all the available chains.
 * and adds the balance values of the IChainAccounts in the correct place
 */
export const devideChains = (
  chains: IChainAccounts,
): {
  chains1: IChainAccounts;
  chains2: IChainAccounts;
  maxValue: number;
} => {
  const half = Math.ceil(chains.length / 2);
  return {
    chains1: chains.slice(0, half),
    chains2: chains.slice(half),
    maxValue: chains.reduce((acc: number, val) => {
      if (typeof val === 'string') return acc;
      return val.balance > acc ? val.balance : acc;
    }, 0),
  };
};
