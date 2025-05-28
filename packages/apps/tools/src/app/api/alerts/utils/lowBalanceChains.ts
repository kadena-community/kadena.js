import type { IAlert, IChainAccount } from './constants';

export const lowBalanceChains = (
  alert: IAlert,
  chainAccounts: IChainAccount[] | undefined,
): IChainAccount[] => {
  const minBalance = alert.options?.minBalance;
  if (!chainAccounts?.length || !minBalance) return [];

  const chainsToCheck = chainAccounts.filter(
    (chain) => alert.chainIds.indexOf(chain.chainId) > -1,
  );

  const lowChains = chainsToCheck.filter(
    (chainAccount) => chainAccount.balance < minBalance,
  );

  return lowChains;
};
