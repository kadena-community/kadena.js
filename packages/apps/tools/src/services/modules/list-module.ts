import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';

import type { Network } from '@/constants/kadena';
import {
  getKadenaConstantByNetwork,
  kadenaConstants,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:list-module');

export interface IModulesResult {
  status?: string;
  data?: string[];
  chainId: ChainwebChainId;
}

export const listModules = async (
  chainId: ChainwebChainId,
  network: Network,
  senderAccount: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModulesResult> => {
  debug(listModules.name);
  const networkId = chainNetwork[network].network;
  const { local } = createClient(
    getKadenaConstantByNetwork(network).apiHost({
      networkId,
      chainId,
    }),
  );

  const transaction = Pact.builder
    .execution('(list-modules)')
    .setMeta({ gasLimit, gasPrice, ttl, senderAccount, chainId })
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
    chainId,
  };
};
