import type { IChainAccount } from './constants';

export const creatLowChainsString = (chains: IChainAccount[]) => {
  return chains
    .map((chain) => {
      return `*chain ${chain.chainId}:* (${chain.balance.toLocaleString(undefined, { maximumFractionDigits: 20 })} KDA)`;
    })
    .join('\n');
};
