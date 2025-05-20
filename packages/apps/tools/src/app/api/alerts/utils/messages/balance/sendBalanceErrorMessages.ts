import type { IAlert, INETWORK } from '../../constants';
import { createMessage } from '../createMessage';

export const sendBalanceErrorMessages = async (
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
            text: `For *${alert.code}:*\nWe were unable to retrieve the account balance (${alert.options?.account}). \n There seems to be an issue with the Graph ${network.label}`,
          },
        },
      ]),
    });

    await createMessage(body);
  });

  await Promise.all(promises);

  return `❌ errormessage send for ${alert.code} (${network.label})`;
};
