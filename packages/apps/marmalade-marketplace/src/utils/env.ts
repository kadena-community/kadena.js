import type { ChainId } from '@kadena/client';

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const START_BLOCK = process.env.NEXT_PUBLIC_START_BLOCK;
const CHAIN_IDS = process.env.NEXT_PUBLIC_CHAIN_IDS;
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME;
const NAMESPACE = process.env.NEXT_PUBLIC_CONTRACT_NAMESPACE;
const GRAHQLURL = process.env.NEXT_PUBLIC_GRAHQLURL;
const CHAINWEB_API_HOST = process.env.NEXT_PUBLIC_CHAINWEB_API_HOST;
const CHAINWEBAPIURL = process.env.NEXT_PUBLIC_CHAINWEBAPIURL;
const MAXSIGNERS = Number(process.env.NEXT_PUBLIC_MAXSIGNERS);
const FAUCET_CONTRACT = process.env.NEXT_PUBLIC_FAUCET_CONTRACT;
const FAUCET_ACCOUNT = process.env.NEXT_PUBLIC_FAUCET_ACCOUNT;
const WEBAUTHN_WALLET = process.env.NEXT_PUBLIC_WEBAUTHN_WALLET;

if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) console.error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!CHAIN_IDS) console.error('NEXT_PUBLIC_CHAINID is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!NETWORK_NAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');
if (!GRAHQLURL) console.error('NEXT_PUBLIC_GRAHQLURL is not set');
if (!CHAINWEB_API_HOST)
  console.error('NEXT_PUBLIC_CHAINWEB_API_HOST is not set');
if (!CHAINWEBAPIURL) console.error('NEXT_PUBLIC_CHAINWEBAPIURL is not set');
if (!MAXSIGNERS) console.error('NEXT_PUBLIC_MAXSIGNERS is not set');
if (!MAXSIGNERS) console.error('NEXT_PUBLIC_MAXSIGNERS is not set');
if (!FAUCET_CONTRACT) console.error('NEXT_PUBLIC_FAUCET_CONTRACT is not set');
if (!FAUCET_ACCOUNT) console.error('NEXT_PUBLIC_FAUCET_ACCOUNT is not set');
if (!WEBAUTHN_WALLET) console.error('NEXT_PUBLIC_WEBAUTHN_WALLET is not set');

const EVENTS_TO_INDEX = `
marmalade-v2.ledger.OFFER,
marmalade-v2.ledger.SALE,
marmalade-v2.ledger.BUY,
marmalade-v2.ledger.WITHDRAW,
marmalade-v2.policy-manager.QUOTE,
marmalade-sale.conventional-auction.AUCTION_CREATED,
marmalade-sale.conventional-auction.MANAGE_AUCTION,
marmalade-sale.conventional-auction.BID_PLACED,
marmalade-sale.dutch-auction.AUCTION_CREATED,
marmalade-sale.dutch-auction.MANAGE_AUCTION,
marmalade-sale.dutch-auction.PRICE_ACCEPTED
`;

export const env = {
  MAXSIGNERS,
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
  URL,
  START_BLOCK: START_BLOCK ? Number(START_BLOCK) : 0,
  CHAIN_IDS: CHAIN_IDS?.split(',') as ChainId[],
  EVENTS:
    EVENTS_TO_INDEX?.replaceAll('\n', '').replaceAll(' ', '')?.split(',') || [],
  NETWORKID: NETWORKID ?? 'testnet04',
  NAMESPACE,
  NETWORK_NAME,
  GRAHQLURL: GRAHQLURL ?? 'https://graph.testnet.kadena.network/graphql',
  CHAINWEB_API_HOST,
  CHAINWEBAPIURL:
    CHAINWEBAPIURL ??
    `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`,
  FAUCET_CONTRACT,
  FAUCET_ACCOUNT,
  WEBAUTHN_WALLET
};
