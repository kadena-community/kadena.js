import { creatLowChainsString } from '../utils/creatLowChainsString';
import type { IAccount, IChainAccount, INETWORK } from './../constants';
import { channelId, tokenId, xchainGasStationAccount } from './../constants';

export const sendMessage = async (
  data: IAccount,
  lowBalanceChains: IChainAccount[],
  network: INETWORK,
): Promise<void> => {
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
            text: `Low XCHAIN GASSTATION alert! ⛽️`,
          },
        },
        {
          type: 'section',
          accessory: {
            type: 'image',
            image_url:
              'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdmOHF0dmw2a3VvMTFicjRxd2lrYm84NHBuZGkzYWN1OHBvaHBzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q533vkOYUF5LSyprvd/giphy.gif',
            alt_text: `${Math.random()}`,
          },
          text: {
            type: 'mrkdwn',
            text: `The XChain GasStation (\`${xchainGasStationAccount}\`) seems to be running low on funds (${network.label}):\n ${creatLowChainsString(lowBalanceChains)}`,
          },
        },
      ]),
    }),
  });
};

export const sendErrorMessage = async (network: INETWORK): Promise<void> => {
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
            text: `*XChain GasStation funds:*\nWe were unable to retrieve the xchain gasstation account balance. \n There seems to be an issue with the Graph (${network.label})`,
          },
        },
      ]),
    }),
  });
};
