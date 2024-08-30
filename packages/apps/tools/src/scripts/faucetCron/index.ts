import dotenv from 'dotenv';
dotenv.config();

const channelId = process.env.SLACK_CHANNELID;
const tokenId = process.env.SLACK_TOKEN;

const sendMessage = async () => {
  const result = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${tokenId}`,
    },
    body: JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'The faucet seems to be running low on funds (TESTNET) 💸',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click Me',
              },
              url: 'https://google.com',
            },
          ],
        },
      ]),
    }),
  });

  const data = await result.json();
  return data;
};

const runJob = async () => {
  const result = await sendMessage();
  console.log({ result });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runJob();
