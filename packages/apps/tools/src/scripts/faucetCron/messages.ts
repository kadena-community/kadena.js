import { creatLowChainsString, lowFaucetChains } from '.';
import type { IAccount } from './constants';
import { MINBALANCE, channelId, tokenId } from './constants';

export const sendMessage = async (data: IAccount): Promise<any> => {
  const lowChains = lowFaucetChains(
    data.data?.fungibleAccount.chainAccounts,
    MINBALANCE,
  );

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
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Low Faucet alert! 🚨`,
          },
        },
        {
          type: 'section',
          accessory: {
            type: 'image',
            image_url:
              'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
            alt_text: `${Math.random()}`,
          },
          text: {
            type: 'mrkdwn',
            text: `The faucet seems to be running low on funds (TESTNET):\n ${creatLowChainsString(lowChains)}`,
          },
        },

        // {
        //   type: 'actions',
        //   elements: [
        //     {
        //       type: 'button',
        //       text: {
        //         type: 'plain_text',
        //         text: 'Click Me',
        //       },
        //       url: 'https://google.com',
        //     },
        //   ],
        // },
      ]),
    }),
  });

  const d = await result.json();
  return d;
};
export const sendErrorMessage = async (): Promise<void> => {
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
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'We were unable to retrieve the faucet account balance. \n There seems to be an issue with the Graph',
          },
        },
      ]),
    }),
  });
};
