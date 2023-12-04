const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const CHAINWEB_URL = process.env.NEXT_PUBLIC_CHAINWEB_URL;
const NETWORKNAME = process.env.NEXT_PUBLIC_NETWORKNAME;
const NETWORKID = process.env.NEXT_PUBLIC_NETWORKID;
const CHAINID = process.env.NEXT_PUBLIC_CHAINID;

if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) console.error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!CHAINWEB_URL) console.error('NEXT_PUBLIC_CHAINWEB_URL is not set');
if (!NETWORKNAME) console.error('NEXT_PUBLIC_NETWORKNAME is not set');
if (!NETWORKID) console.error('NEXT_PUBLIC_NETWORKID is not set');
if (!CHAINID) console.error('NEXT_PUBLIC_CHAINID is not set');

export const env = {
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
  CHAINWEB_URL,
  NETWORKNAME,
  NETWORKID,
  CHAINID,
};
