import { tokenId } from '@/scripts/constants';
import { creatLowChainsString } from '@/scripts/utils/creatLowChainsString';
import type { IAlert, IChainAccount, INETWORK } from './constants';

const createMessage = async (body: BodyInit): Promise<void> => {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${tokenId}`,
    },
    body,
  });
};

export const sendMessages = async (
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
export const sendErrorMessages = async (
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
