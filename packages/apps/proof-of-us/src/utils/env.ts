const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
const TESTNUMBER = Number(process.env.NEXT_PUBLIC_TESTNUMBER);
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;

if (!TRACKING_ID) throw Error('NEXT_PUBLIC_TRACKING_ID is not set');
if (!TESTNUMBER) throw Error('NEXT_PUBLIC_TESTNUMBER is not set');
if (!WALLET_URL) throw Error('NEXT_PUBLIC_WALLET_URL is not set');

export const env = {
  TRACKING_ID,
  TESTNUMBER,
  WALLET_URL,
};
