import type { INetworks } from '../pactjs.types.js';

export const networkMap: INetworks = {
  mainnet: { network: 'mainnet01', api: 'api.chainweb.com' },
  testnet: { network: 'testnet04', api: 'api.testnet.chainweb.com' },
} as const;
