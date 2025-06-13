import { format } from 'date-fns';
import type { IAlert, INETWORK } from '../../constants';
import { createMessage } from './../createMessage';

export const sendBalanceChangeMessages = async (
  alert: IAlert,
  [latestChain2, previousChain2]: string[],
  network: INETWORK,
  [latest, previous]: Record<string, any>[],
): Promise<string> => {
  const promises = alert.slackChannelIds.map((channelId) => {
    const body = JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: alert.title,
          },
        },
        {
          type: 'section',
          accessory: alert.options?.gif
            ? {
                type: 'image',
                image_url: alert.options.gif,
                alt_text: `${Math.random()}`,
              }
            : undefined,
          text: {
            type: 'mrkdwn',
            text: `The balance for ${alert.code} (\`${alert.options?.account}\`) has changed (${network.key}):\n *previous balance* ${previousChain2} (elastic record: ${latest._id} - ${format(new Date(latest._source['@timestamp']), 'yyyy-mm-dd h:mm a')})\n *latest balance* ${latestChain2} (elastic record: ${previous._id} - ${format(new Date(previous._source['@timestamp']), 'yyyy-mm-dd h:mm a')})`,
          },
        },
      ]),
    });

    return createMessage(body);
  });

  await Promise.all(promises);

  return `✅ message send for ${alert.code} (${network.key})`;
};
