import { fetchAccount } from '@/utils/fetchAccount';
import { getClient } from '../../elasticClient';
import type { IAlert } from './../../constants';

export const balanceCheck = async (alert: IAlert): Promise<string[]> => {
  const client = getClient();

  const promises = alert.networks.map(async (network) => {
    if (!alert.options?.account) {
      return `❌ errormessage send for ${alert.code} (${network.label})`;
    }
    const account = await fetchAccount(network, alert.options?.account);
    let data: Record<string, any> = {
      '@timestamp': new Date().toISOString(),
      code: alert.code,
      address: alert.options?.account,
    };
    if (account?.errors?.length) {
      data = { ...data, error: 'no account was found' };
    }

    if (!account.data?.fungibleAccount) {
      return `❌ elastic data fail ${alert.code} (${network.key}): account not found for ${alert.options?.account}`;
    }

    const promises = (account.data?.fungibleAccount.chainAccounts ?? []).map(
      async (chain): Promise<string> => {
        const balanceData = {
          ...data,
          chain_id: chain.chainId,
          balance: chain.balance,
          balance_type: 'native',
        };

        //send data
        try {
          await client.index(balanceData, network);
          return `✅ elastic data send for ${alert.code} chain:${chain.chainId} (${network.key})`;
        } catch (e) {
          return `❌ elastic data fail ${alert.code} chain:${chain.chainId} (${network.key}): (${e.meta.body.error.reason})`;
        }
      },
    );

    const promiseResults = await Promise.all(promises);

    return promiseResults;
  });

  const promiseResults = await Promise.all(promises);
  return promiseResults.flat().filter(Boolean);
};
