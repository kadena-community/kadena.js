import type { ChainId } from '@kadena/types';
import type { IAlert, INETWORK } from '../../constants';
import { createMessage } from './../createMessage';

export const sendBalanceChangeMessages = async (
  alert: IAlert,
  [latestChain2, previousChain2]: string[],
  network: INETWORK,
  chainId: ChainId,
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
            text: `The balance for ${alert.code} (\`${alert.options?.account}\`) on chainId:\`${chainId}\` has changed (${network.key}):
${parseFloat(previousChain2).toLocaleString(undefined, { maximumFractionDigits: 20 })} KDA -> ${parseFloat(latestChain2).toLocaleString(undefined, { maximumFractionDigits: 20 })} KDA`,
          },
        },
      ]),
    });

    return createMessage(body);
  });

  await Promise.all(promises);

  return `✅ message send for ${alert.code} (${network.key})`;
};
