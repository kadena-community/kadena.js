import type { IAlert, INETWORK } from '../../constants';
import { createMessage } from '../createMessage';

export const sendBalanceChangeErrorMessages = async (
  alert: IAlert,
  network: INETWORK,
): Promise<string> => {
  const promises = alert.slackChannelIds.map(async (channelId) => {
    const body = JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `For *${alert.code}:*\nThe balance data on elastic search for account ${alert.options?.account} is older than 20 minutes. \n There seems to be an issue with elastic search.`,
          },
        },
      ]),
    });

    await createMessage(body);
  });

  await Promise.all(promises);

  return `❌ errormessage send for ${alert.code} (${network.label})`;
};
