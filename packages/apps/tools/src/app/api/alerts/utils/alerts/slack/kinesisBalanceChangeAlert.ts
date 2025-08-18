import { differenceInMinutes } from 'date-fns';
import { getClient } from '../../elasticClient';
import { sendKinesisBalanceChangeErrorMessages } from '../../messages/kinesisBalanceChange/sendKinesisBalanceChangeErrorMessages';
import { sendKinesisBalanceChangeMessages } from '../../messages/kinesisBalanceChange/sendKinesisBalanceChangeMessages';
import type { IAlert } from './../../constants';

export const checkIfBalanceChangeAlert = (
  hourAgoBalance: number,
  nowBalance: number,
): boolean => {
  const tenPercentThreshold = hourAgoBalance * 0.1;

  if (nowBalance <= hourAgoBalance - tenPercentThreshold) {
    console.log(
      `Balance has decreased by more than 10%: ${hourAgoBalance} -> ${nowBalance}`,
    );
    return true;
  }
  return false;
};

export const kinesisBalanceChangeAlert = async (
  alert: IAlert,
): Promise<string[]> => {
  const promises = alert.networks.map(async (network) => {
    const client = getClient();

    const records = await client.getRecordsOfLastHour(alert, network);

    if (records.length < 4) {
      return sendKinesisBalanceChangeErrorMessages(alert, network);
    }

    const hourAgoRecord = records[0];
    const nowRecord = records[records.length - 1];

    // adding this console for debugging purposes
    console.log({ hourAgoRecord, nowRecord });

    // if the latest record is older than 20 minutes, send an error message
    // because the elastic database might not be updated
    const latestTimeDiff = differenceInMinutes(
      Date.now(),
      new Date(nowRecord._source['@timestamp']),
    );
    if (latestTimeDiff > 20) {
      return sendKinesisBalanceChangeErrorMessages(alert, network);
    }

    const nowBalance = nowRecord._source.balance;
    const hourAgoBalance = hourAgoRecord._source.balance;

    // check if the balance has been lowerd by more that 10%
    if (checkIfBalanceChangeAlert(hourAgoBalance, nowBalance)) {
      return sendKinesisBalanceChangeMessages(alert, network, [
        nowRecord,
        hourAgoRecord,
      ]);
    }

    return new Promise<string>((resolve) =>
      resolve(`◻️ no need for a message ${alert.code} (${network.key})`),
    );
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};
