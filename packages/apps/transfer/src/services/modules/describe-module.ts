import {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { getClient, Pact } from '@kadena/client';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:describe-module');

export const describeModule = async (
  moduleName: string,
  chainId: ChainwebChainId,
  network: Network,
  sender: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<ILocalCommandResult> => {
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

  return await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });
};
