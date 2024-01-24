const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;
const URL = process.env.NEXT_PUBLIC_URL;

if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) console.error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) console.error('NEXT_PUBLIC_WALLET_URL is not set');
if (!URL) console.error('NEXT_PUBLIC_URL is not set');

export const env = {
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
  URL,
};
