import { format } from 'date-fns';
import type { IAlert, IChainAccount, INETWORK } from '../../constants';
import { creatLowChainsString } from '../../creatLowChainsString';
import { createMessage } from './../createMessage';

export const sendBalanceChangeMessages = async (
  alert: IAlert,
  [latestChain2, previousChain2]: IChainAccount[],
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
            text: `The balance for ${alert.code} (\`${alert.options?.account}\`) has changed (${network.key}):\n *previous balance* ${creatLowChainsString([previousChain2])} (elastic record: ${latest._id} - ${format(latest._source.timestamp, 'yyyy-mm-dd h:mm a')})\n *latest balance* ${creatLowChainsString([latestChain2])} (elastic record: ${previous._id} - ${format(previous._source.timestamp, 'yyyy-mm-dd h:mm a')})`,
          },
        },
      ]),
    });

    return createMessage(body);
  });

  await Promise.all(promises);

  return `✅ message send for ${alert.code} (${network.key})`;
};
