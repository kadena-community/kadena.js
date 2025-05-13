import { lowBalanceChains } from '@/scripts/utils/lowBalanceChains';
import { fetchAccount } from '@/utils/fetchAccount';
import type { IAlert } from './constants';
import { sendErrorMessages, sendMessages } from './messages';

export const balanceAlert = async (alert: IAlert): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const account = await fetchAccount(network, alert.options?.account);

    if (account?.errors?.length) {
      return sendErrorMessages(alert, network);
    }

    const lowBalanceChainsResult = lowBalanceChains(
      alert,
      account?.data?.fungibleAccount.chainAccounts,
    );
    if (!lowBalanceChainsResult.length) return;

    return sendMessages(alert, lowBalanceChainsResult, network);
  });

  const results = await Promise.all(promises);
  return results.filter((v) => v !== undefined);
};
