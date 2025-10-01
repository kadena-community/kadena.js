const URL = process.env.NEXT_PUBLIC_URL;
const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;

if (!URL) console.error('NEXT_PUBLIC_URL is not set');
if (!TRACKING_ID) console.error('NEXT_PUBLIC_TRACKING_ID is not set');

export const env = {
  URL,
  TRACKING_ID: TRACKING_ID ?? '',
} as const;
