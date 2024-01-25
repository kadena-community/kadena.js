export const NETWORK_ID = process.env.NEXT_PUBLIC_KADENA_NETWORK_ID;
export const CHAIN_ID = process.env.NEXT_PUBLIC_KADENA_CHAIN_ID;
export const HOST = process.env.NEXT_PUBLIC_KADENA_HOST;

export const API_HOST = `https://${HOST}/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
