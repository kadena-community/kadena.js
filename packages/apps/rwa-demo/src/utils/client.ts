import type { INetwork } from '@/contexts/NetworkContext/NetworkContext';
import { createClient } from '@kadena/client';
import { env } from './env';

export const getClient = (url?: string) => {
  const client = createClient(url ? url : env.CHAINWEBAPIURL);
  return client;
};

export const getNetwork = (): INetwork => {
  return {
    name: env.NETWORKNAME,
    networkId: env.NETWORKID,
    host: env.NETWORKHOST,
    chainId: env.CHAINID,
    graphUrl: env.GRAPHURL,
  };
};
