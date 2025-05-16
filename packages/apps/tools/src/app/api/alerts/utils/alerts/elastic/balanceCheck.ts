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
      description: alert.description,
      code: alert.code,
      address: alert.options?.account,
      minBalance: alert.options?.minBalance,
      timestamp: Date.now(),
      network: {
        environment: network.key,
        environmentLabel: network.label,
      },
    };
    if (account?.errors?.length) {
      data = { ...data, error: 'no account was found' };
    }

    data = {
      ...data,
      balances: account.data?.fungibleAccount.chainAccounts,
    };

    //send data
    try {
      await client.index(data);

      return `✅ elastic data send for ${alert.code} (${network.key})`;
    } catch (e) {
      return `❌ elastic data fail ${alert.code} (${network.label}): (${e.meta.body.error})`;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};
