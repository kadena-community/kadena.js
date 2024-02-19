const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const CHAINID = process.env.NEXT_PUBLIC_CHAINID ?? '14';
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const NETWORKNAME = process.env.NEXT_PUBLIC_NETWORKNAME;
const NAMESPACE = process.env.NEXT_PUBLIC_CONTRACT_NAMESPACE;

if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) console.error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!CHAINID) console.error('NEXT_PUBLIC_CHAINID is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!NETWORKNAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');

export const env = {
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
  URL,
  CHAINID,
  NETWORKID,
  NAMESPACE,
  NETWORKNAME,
};
