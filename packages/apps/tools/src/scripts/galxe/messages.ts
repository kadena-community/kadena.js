import { creatLowChainsString } from '../utils/creatLowChainsString';
import type { IAccount, IChainAccount, INETWORK } from './../constants';
import { channelId, GalxeAccount, tokenId } from './../constants';

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
            text: `Low GALXE account alert! ⛽️`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `The GalXe account (\`${GalxeAccount}\`) seems to be running low on funds (${network.label}):\n ${creatLowChainsString(lowBalanceChains)}`,
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
            text: `*GalXe account funds:*\nWe were unable to retrieve the Galxe account balance. \n There seems to be an issue with the Graph (${network.label})`,
          },
        },
      ]),
    }),
  });
};
