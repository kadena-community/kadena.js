import { fetchAccount } from '@/utils/fetchAccount';
import { lowBalanceChains } from '../../lowBalanceChains';
import type { IAlert } from './../../constants';
import { sendBalanceErrorMessages } from './../../messages/balance/sendBalanceErrorMessages';
import { sendBalanceMessages } from './../../messages/balance/sendBalanceMessages';

export const balanceCheck = async (alert: IAlert): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const account = await fetchAccount(network, alert.options?.account);

    if (account?.errors?.length) {
      return sendBalanceErrorMessages(alert, network);
    }

    const lowBalanceChainsResult = lowBalanceChains(
      alert,
      account?.data?.fungibleAccount.chainAccounts,
    );
    if (!lowBalanceChainsResult.length) return;

    return sendBalanceMessages(alert, lowBalanceChainsResult, network);
  });

  const results = await Promise.all(promises);
  const filteredResults = results.filter((v) => v !== undefined);
  return filteredResults as string[];
};
