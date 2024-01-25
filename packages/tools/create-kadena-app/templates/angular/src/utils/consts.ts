import { environment } from '../environments/environment';

const { kadenaNetworkId, kadenaChainId, kadenaHost } = environment;

export const NETWORK_ID = kadenaNetworkId;
export const CHAIN_ID = kadenaChainId;
export const HOST = kadenaHost;

export const API_HOST = `https://${HOST}/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
