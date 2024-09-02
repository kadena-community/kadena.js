import { createClient, Pact } from '@kadena/client';
import dotenv from 'dotenv';
dotenv.config();

const channelId = process.env.SLACK_CHANNELID;
const tokenId = process.env.SLACK_TOKEN;

const client = createClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact',
);

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
const sendErrorMessage = async () => {
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
            text: 'We were unable to retrieve the faucet account balance. \n There seems to be an issue with Chainweaver',
          },
        },
      ]),
    }),
  });

  const data = await result.json();
  return data;
};

const getFaucetAccount = async () => {
  const transaction = Pact.builder
    .execution(
      `(coin.get-balance "c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA")`,
    )
    .setNetworkId('testnet04')
    .setMeta({
      chainId: `9`,
    })
    .createTransaction();

  return await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });
};

const runJob = async () => {
  const accountResult = await getFaucetAccount();

  console.log(accountResult);

  return;
  if (accountResult.result.status !== 'success') {
    await sendErrorMessage();
    return;
  }

  //   const result = await sendMessage();
  //   console.log({ result });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runJob();
