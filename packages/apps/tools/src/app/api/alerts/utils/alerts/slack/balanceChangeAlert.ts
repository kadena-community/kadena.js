import { differenceInMinutes } from 'date-fns';
import { getClient } from '../../elasticClient';
import { sendBalanceChangeErrorMessages } from '../../messages/balanceChange/sendBalanceChangeErrorMessages';
import { sendBalanceChangeMessages } from '../../messages/balanceChange/sendBalanceChangeMessages';
import type { IAlert } from './../../constants';

export const balanceChangeAlert = async (alert: IAlert): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const client = getClient();

    const [latest, previous] = await client.getLastRecord(alert, network);

    console.log({ latest, previous });

    const latestTimeDiff = differenceInMinutes(
      Date.now(),
      new Date(latest._source['@timestamp']),
    );
    if (latestTimeDiff > 20) {
      return sendBalanceChangeErrorMessages(alert, network);
    }

    const latestChain2Balance = latest._source.balance;
    const previousChain2Balance = previous._source.balance;

    if (latestChain2Balance !== previousChain2Balance) {
      return sendBalanceChangeMessages(
        alert,
        [latestChain2Balance, previousChain2Balance],
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
