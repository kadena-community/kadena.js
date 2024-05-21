import type { ChainId } from '@kadena/client';

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const START_BLOCK = process.env.NEXT_PUBLIC_START_BLOCK;
const CHAIN_IDS = process.env.NEXT_PUBLIC_CHAIN_IDS;
const EVENTS = process.env.NEXT_PUBLIC_EVENTS;
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const NETWORKNAME = process.env.NEXT_PUBLIC_NETWORKNAME;
const NAMESPACE = process.env.NEXT_PUBLIC_CONTRACT_NAMESPACE;
const GRAHQLURL = process.env.NEXT_PUBLIC_GRAHQLURL;
const CHAINWEBAPIURL = process.env.NEXT_PUBLIC_CHAINWEBAPIURL;
const MAXSIGNERS = Number(process.env.NEXT_PUBLIC_MAXSIGNERS);

if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) console.error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!CHAIN_IDS) console.error('NEXT_PUBLIC_CHAINID is not set');
if (!EVENTS) console.error('NEXT_PUBLIC_EVENTS is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!NETWORKNAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');
if (!GRAHQLURL) console.error('NEXT_PUBLIC_GRAHQLURL is not set');
if (!CHAINWEBAPIURL) console.error('NEXT_PUBLIC_CHAINWEBAPIURL is not set');
if (!MAXSIGNERS) console.error('NEXT_PUBLIC_MAXSIGNERS is not set');

export const env = {
  MAXSIGNERS,
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
  URL,
  START_BLOCK: START_BLOCK ? Number(START_BLOCK) : 0,
  CHAIN_IDS: CHAIN_IDS?.split(',') as ChainId[],
  EVENTS: EVENTS?.replaceAll('\n', '').replaceAll(' ', '')?.split(',') || [],
  NETWORKID: NETWORKID ?? 'testnet04',
  NAMESPACE,
  NETWORKNAME,
  GRAHQLURL: GRAHQLURL ?? 'https://graph.testnet.kadena.network/graphql',
  CHAINWEBAPIURL:
    CHAINWEBAPIURL ??
    `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`,
};
