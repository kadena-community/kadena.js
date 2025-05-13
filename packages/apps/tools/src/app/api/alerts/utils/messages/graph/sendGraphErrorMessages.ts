import type { IAlert, INETWORK } from '../../constants';
import { createMessage } from '../createMessage';

export const sendGraphErrorMessages = async (
  alert: IAlert,
  network: INETWORK,
  {
    title,
    msg,
  }: {
    title: string;
    msg: string;
  },
): Promise<string> => {
  const promises = alert.slackChannelIds.map((channelId) => {
    const body = JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: title ? `# ${title}` : alert.title,
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
            text: msg,
          },
        },
      ]),
    });

    return createMessage(body);
  });

  await Promise.all(promises);

  return `✅ message send for ${alert.code} (${network.key})`;
};
