import type { ChainId } from '@kadena/client';

const URL = process.env.NEXT_PUBLIC_URL;
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const CHAINID = process.env.NEXT_PUBLIC_CHAINID;
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const NETWORKNAME = process.env.NEXT_PUBLIC_NETWORKNAME;
const NETWORKHOST = process.env.NEXT_PUBLIC_NETWORKHOST;
const CHAINWEBAPIURL = process.env.NEXT_PUBLIC_CHAINWEBAPIURL;
const GRAPHURL = process.env.NEXT_PUBLIC_GRAPHURL;
const ZEROADDRESS = process.env.NEXT_PUBLIC_ZEROADDRESS;

if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!CHAINID) console.error('NEXT_PUBLIC_CHAINID is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!NETWORKNAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');
if (!NETWORKHOST) console.error('NEXT_PUBLIC_NETWORKHOST is not set');
if (!CHAINWEBAPIURL) console.error('NEXT_PUBLIC_CHAINWEBAPIURL is not set');
if (!GRAPHURL) console.error('NEXT_PUBLIC_GRAPHURL is not set');
if (!ZEROADDRESS) console.error('NEXT_PUBLIC_ZEROADDRESS is not set');

export const env = {
  WALLET_URL,
  URL,
  CHAINID: (CHAINID ?? '1') as ChainId,
  NETWORKID: NETWORKID ?? 'testnet04',
  NETWORKNAME: NETWORKNAME ?? '',
  NETWORKHOST: NETWORKHOST ?? '',
  CHAINWEBAPIURL: CHAINWEBAPIURL ?? '',
  GRAPHURL: GRAPHURL ?? '',
  ZEROADDRESS: ZEROADDRESS!,
} as const;
