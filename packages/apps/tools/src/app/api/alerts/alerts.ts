import { getMainNet, getTestNet } from '@/utils/network';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from './utils/constants';
import {
  ALERTCODES,
  channelId,
  faucetAccount,
  GalxeAccount,
  MAXBLOCKHEIGHT_DIFFERENCE,
  MESSAGETYPES,
  MINBALANCE,
  MINXCHAINGASSTATIONBALANCE,
  MINXGALXEBALANCE,
  NETWORKS,
  xchainGasStationAccount,
} from './utils/constants';

export const alerts: IAlert[] = [
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
    cronType: '12hours',
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
    cronType: '12hours',
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
    cronType: '12hours',
    isElastic: true,
  },
  {
    title: `GRAPH DOWN!`,
    code: ALERTCODES.GRAPHDOWN,
    networks: [],
    options: {
      maxblockHeightDiff: MAXBLOCKHEIGHT_DIFFERENCE,
    },
    chainIds: CHAINS,
    slackChannelIds: [channelId],
    messageType: MESSAGETYPES.GRAPHDOWNALERT,
    cronType: '12hours',
  },
] as const;
