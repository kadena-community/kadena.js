import { markdownToBlocks } from '@tryfabric/mack';
import { log } from '.';
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
      blocks: log(
        JSON.stringify(
          await markdownToBlocks(
            [title ? `# ${title}` : `# Error in Graph check! 🚨`, `${msg}`]
              .filter(Boolean)
              .join('\n'),
          ),
        ),
        'Sending Error Message:',
      ),
    }),
  })
    .then(async (res) => console.log(await res.json()))
    .catch(console.error);
};
