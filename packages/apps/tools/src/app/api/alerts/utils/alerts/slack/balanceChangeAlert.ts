import { fetchAccount } from '@/utils/fetchAccount';
import type { IAlert } from './../../constants';

export const balanceChangeAlert = async (alert: IAlert): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const events = await fetchAccount(network, alert.options?.account);
    console.log({ events });

    return `✅ message send for ${alert.code} (${network.key})`;
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};
