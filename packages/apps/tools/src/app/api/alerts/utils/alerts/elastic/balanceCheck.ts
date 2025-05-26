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
      '@timestamp': Date.now(),
      code: alert.code,
      address: alert.options?.account,
    };
    if (account?.errors?.length) {
      data = { ...data, error: 'no account was found' };
    }

    data = {
      ...data,
    };

    const promises = account.data?.fungibleAccount.chainAccounts.map(
      async (chain) => {
        const balanceData = {
          ...data,
          chain_id: chain.chainId,
          balance: chain.balance,
          balance_type: 'native',
        };
        return client.index(balanceData, network);

        //send data
        try {
          return `✅ elastic data send for ${alert.code}:${chain.chainId} (${network.key})`;
        } catch (e) {
          return `❌ elastic data fail ${alert.code}:${chain.chainId} (${network.label}): (${e.meta.body.error})`;
        }
      },
    );

    return promises;
  });

  const promiseResults = await Promise.all(promises);

  const results = promiseResults.map((result) => {
    console.log(11, result);
    return '';
  });

  return results.filter(Boolean);
};
