import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { getClient, Pact } from '@kadena/client';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';
import { PactValue } from '../../../../../libs/types/lib';

export interface IModuleResult {
  reqKey?: string;
  status?: string;
  data?: PactValue;
}

const debug = Debug('kadena-transfer:services:describe-module');

export const describeModule = async (
  moduleName: string,
  chainId: ChainwebChainId,
  network: Network,
  sender: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModuleResult> => {
  debug(describeModule.name);
  const networkId = chainNetwork[network].network;
  const { local } = getClient(
    getKadenaConstantByNetwork(network).apiHost({
      networkId,
      chainId,
    }),
  );

  const transaction = Pact.builder
    .execution(`(describe-module "${moduleName}")`)
    .setMeta({ gasLimit, gasPrice, ttl, sender, chainId })
    .setNetworkId(networkId)
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  const { reqKey, result } = response;

  if (result.status === 'failure') {
    return {
      reqKey,
      status: result.status,
    };
  }

  return {
    reqKey,
    status: result.status,
    data: result.data,
  };
};
