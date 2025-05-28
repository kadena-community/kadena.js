import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from './utils/constants';
import {
  ALERTCODES,
  channelId,
  faucetAccount,
  GalxeAccount,
  getMainNet,
  getTestNet,
  INTERVALGROUPS,
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
    description: 'check the balance of the testnet faucet account',
    code: ALERTCODES.LOWFAUCETBALANCE,
    networks: [getTestNet()],
    options: {
      account: faucetAccount,
      minBalance: MINBALANCE,
      gif: 'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
    },
    chainIds: CHAINS,
    slackChannelIds: [channelId],
    messageType: {
      slack: MESSAGETYPES.slack.BALANCEALERT,
      elastic: MESSAGETYPES.elastic.BALANCEALERT,
    },
    intervalGroup: INTERVALGROUPS['12hours'],
  },
  {
    title: `Low XCHAIN GASSTATION alert! ⛽️`,
    description: 'check the balance of the XChain gasstation account',
    code: ALERTCODES.LOWXCHAINGASBALANCE,
    networks: NETWORKS,
    options: {
      account: xchainGasStationAccount,
      minBalance: MINXCHAINGASSTATIONBALANCE,
      gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdmOHF0dmw2a3VvMTFicjRxd2lrYm84NHBuZGkzYWN1OHBvaHBzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q533vkOYUF5LSyprvd/giphy.gif',
    },
    chainIds: CHAINS,
    slackChannelIds: [channelId],
    messageType: {
      slack: MESSAGETYPES.slack.BALANCEALERT,
      elastic: MESSAGETYPES.elastic.BALANCEALERT,
    },
    intervalGroup: INTERVALGROUPS['12hours'],
  },
  {
    title: `Low GALXE account alert! ⛽️`,
    description: 'check the balance of the GALXE account',
    code: ALERTCODES.LOWXGALXEBALANCE,
    networks: [getMainNet()],
    options: {
      account: GalxeAccount,
      minBalance: MINXGALXEBALANCE,
    },
    chainIds: ['8'],
    slackChannelIds: [channelId],
    messageType: {
      slack: MESSAGETYPES.slack.BALANCEALERT,
      elastic: MESSAGETYPES.elastic.BALANCEALERT,
    },
    intervalGroup: INTERVALGROUPS['12hours'],
  },
  {
    title: `GRAPH DOWN!`,
    description: 'check if the Graph is down',
    code: ALERTCODES.GRAPHDOWN,
    networks: [],
    options: {
      maxblockHeightDiff: MAXBLOCKHEIGHT_DIFFERENCE,
    },
    chainIds: CHAINS,
    slackChannelIds: [channelId],
    messageType: {
      slack: MESSAGETYPES.slack.GRAPHALERT,
    },
    intervalGroup: INTERVALGROUPS['12hours'],
  },
  {
    title: `Kinesis Bridge balance`,
    description: 'Changes to the Kinesis Bridge balance on chain 2',
    code: ALERTCODES.KINESISBRIDGEBALANCECHANGE,
    networks: [getMainNet()],
    options: {
      account: process.env.KINESISBRIDGEACCOUNT ?? '',
      maxblockHeightDiff: MAXBLOCKHEIGHT_DIFFERENCE,
    },
    chainIds: ['2'],
    slackChannelIds: [channelId],
    messageType: {
      slack: MESSAGETYPES.slack.BALANCECHANGEALERT,
      elastic: MESSAGETYPES.elastic.BALANCECHANGEALERT,
    },
    intervalGroup: INTERVALGROUPS['15minutes'],
  },
] as const;
