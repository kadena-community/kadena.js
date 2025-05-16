import { differenceInMinutes } from 'date-fns';
import { getClient } from '../../elasticClient';
import { sendBalanceChangeErrorMessages } from '../../messages/balanceChange/sendBalanceChangeErrorMessages';
import { sendBalanceChangeMessages } from '../../messages/balanceChange/sendBalanceChangeMessages';
import type { IAlert, IChainAccount } from './../../constants';

export const balanceChangeAlert = async (alert: IAlert): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const client = getClient();

    const [latest, previous] = await client.getLastRecord(alert);

    const latestTimeDiff = differenceInMinutes(
      Date.now(),
      latest._source.timestamp,
    );
    if (latestTimeDiff > 20) {
      return sendBalanceChangeErrorMessages(alert, network);
    }

    //check balance for chain 2.
    const latestChain2 = latest._source.balances.find(
      (balance: any) => balance.chainId === '2',
    ) as IChainAccount;
    const previousChain2 = previous._source.balances.find(
      (balance: any) => balance.chainId === '2',
    ) as IChainAccount;

    if (latestChain2.balance !== previousChain2.balance) {
      return sendBalanceChangeMessages(
        alert,
        [latestChain2, previousChain2],
        network,
        [latest, previous],
      );
    }

    return new Promise<string>((resolve) =>
      resolve(`◻️ no need for a message ${alert.code} (${network.key})`),
    );
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};
