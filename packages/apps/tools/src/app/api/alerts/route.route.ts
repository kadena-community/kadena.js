import {
  channelId,
  faucetAccount,
  GalxeAccount,
  MINBALANCE,
  MINXCHAINGASSTATIONBALANCE,
  MINXGALXEBALANCE,
  xchainGasStationAccount,
} from '@/scripts/constants';
import { getMainNet, getTestNet } from '@/utils/network';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from './utils/constants';
import { ALERTCODES, MESSAGETYPES, NETWORKS } from './utils/constants';

export async function GET() {
  const alerts: IAlert[] = [
    {
      title: `Low Faucet alert! 🚨`,
      code: ALERTCODES.LOWFAUCETBALANCE,
      networks: [getTestNet()],
      options: {
        account: faucetAccount,
        minBalance: MINBALANCE,
        gif: 'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
      },
      chainIds: CHAINS,
      slackChannelIds: [channelId],
      messageType: MESSAGETYPES.BALANCEALERT,
    },
    {
      title: `Low XCHAIN GASSTATION alert! ⛽️`,
      code: ALERTCODES.LOWXCHAINGASBALANCE,
      networks: NETWORKS,
      options: {
        account: xchainGasStationAccount,
        minBalance: MINXCHAINGASSTATIONBALANCE,
        gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdmOHF0dmw2a3VvMTFicjRxd2lrYm84NHBuZGkzYWN1OHBvaHBzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q533vkOYUF5LSyprvd/giphy.gif',
      },
      chainIds: CHAINS,
      slackChannelIds: [channelId],
      messageType: MESSAGETYPES.BALANCEALERT,
    },
    {
      title: `Low GALXE account alert! ⛽️`,
      code: ALERTCODES.LOWXGALXEBALANCE,
      networks: [getMainNet()],
      options: {
        account: GalxeAccount,
        minBalance: MINXGALXEBALANCE,
      },
      chainIds: ['6'],
      slackChannelIds: [channelId],
      messageType: MESSAGETYPES.BALANCEALERT,
    },
  ];

  const promises = alerts.map((alert) => alert.messageType(alert));

  const results = await Promise.all(promises);

  return new Response(results.flat().join('\n'));
}

export const revalidate = 0;
