import { channelId, tokenId } from './../constants';

export const sendErrorMessage = async ({
  title,
  msg,
}: {
  title: string;
  msg: string;
}): Promise<void> => {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${tokenId}`,
    },
    body: JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: title ? title : `Error in Graph check! 🚨`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${msg}`,
          },
        },
      ]),
    }),
  });
};
