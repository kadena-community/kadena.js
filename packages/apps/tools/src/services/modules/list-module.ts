import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { getClient, Pact } from '@kadena/client';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:list-module');

export interface IModulesResult {
  status?: string;
  data?: string[];
}

export const listModules = async (
  chainId: ChainwebChainId,
  network: Network,
  sender: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModulesResult> => {
  debug(listModules.name);
  const networkId = chainNetwork[network].network;
  const { local } = getClient(
    getKadenaConstantByNetwork(network).apiHost({
      networkId,
      chainId,
    }),
  );

  const transaction = Pact.builder
    .execution('(list-modules)')
    .setMeta({ gasLimit, gasPrice, ttl, sender, chainId })
    .setNetworkId(networkId)
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  const { result } = response;

  return {
    status: result.status,
    data: 'data' in result ? (result.data as string[]) : [],
  };
};
