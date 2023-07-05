import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';

export interface IModulesResult {
  status?: string;
  data?: string[];
}

export const listModules = async (
  chainId: ChainId,
  network: Network,
  sender: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModulesResult> => {
  const pactCommand = new PactCommand();

  pactCommand.code = createExp('list-modules');

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  const response = await pactCommand.local(
    getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId,
    }),
    {
      preflight: false,
      signatureVerification: false,
    },
  );

  const { result } = response;

  return {
    status: result.status,
    data: result.data,
  };
};
