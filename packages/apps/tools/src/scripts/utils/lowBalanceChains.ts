import { ChainId } from '@kadena/types';
import type { IChainAccount } from '../constants';

export const lowBalanceChains = (
  chainAccounts: IChainAccount[] | undefined,
  minBalance: number,
): IChainAccount[] => {
  if (!chainAccounts?.length) return [];

  const lowChains = chainAccounts.filter(
    (chainAccount) => chainAccount.balance < minBalance,
  );

  return lowChains;
};
