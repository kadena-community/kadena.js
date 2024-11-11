import type { ChainId } from '@kadena/client';

const URL = process.env.NEXT_PUBLIC_URL;
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const CHAINID = process.env.NEXT_PUBLIC_CHAINID;
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const NETWORKNAME = process.env.NEXT_PUBLIC_NETWORKNAME;
const CHAINWEBAPIURL = process.env.NEXT_PUBLIC_CHAINWEBAPIURL;

if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!CHAINID) console.error('NEXT_PUBLIC_CHAINID is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!NETWORKNAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');
if (!CHAINWEBAPIURL) console.error('NEXT_PUBLIC_CHAINWEBAPIURL is not set');

export const env = {
  WALLET_URL,
  URL,
  CHAINID: (CHAINID ?? '1') as ChainId,
  NETWORKID: NETWORKID ?? 'testnet04',
  NETWORKNAME,
  CHAINWEBAPIURL: CHAINWEBAPIURL,
};
