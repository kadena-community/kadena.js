import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Pact, getClient } from '@kadena/client';
import { createExp } from '@kadena/pactjs';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

export interface IModuleResult {
  reqKey?: string;
  status?: string;
  code?: string;
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
  const { local } = getClient(getKadenaConstantByNetwork(network).apiHost({
    networkId,
    chainId,
  }));

  const transaction = Pact.builder
    .execution(Pact.modules['describe-module'](moduleName))
    .setMeta({ gasLimit, gasPrice, ttl, sender, chainId })
    .setNetworkId(networkId)
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  // const pactCommand = new PactCommand();
  // pactCommand.code = createExp(`describe-module "${moduleName}"`);

  // pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  // const response = await pactCommand.local(
  //   getKadenaConstantByNetwork(network).apiHost({
  //     networkId: chainNetwork[network].network,
  //     chainId,
  //   }),
  //   {
  //     signatureVerification: false,
  //     preflight: false,
  //   },
  // );

  const { reqKey, result } = response;

  return {
    reqKey,
    status: result.status,
    code: result.data?.code,
  };
};
