import { creatLowChainsString } from '@/scripts/utils/creatLowChainsString';
import type { IAlert, IChainAccount, INETWORK } from '../../constants';
import { createMessage } from './../createMessage';

export const sendBalanceMessages = async (
  alert: IAlert,
  data: IChainAccount[],
  network: INETWORK,
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
            text: `The faucet (\`${alert.options?.account}\`) seems to be running low on funds (${network.key}):\n ${creatLowChainsString(data)}`,
          },
        },
      ]),
    });

    return createMessage(body);
  });

  await Promise.all(promises);

  return `✅ message send for ${alert.code} (${network.key})`;
};
