import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';

export interface IModuleResult {
  reqKey?: string;
  status?: string;
  code?: string;
}

export const describeModule = async (
  moduleName: string,
  chainId: ChainId,
  network: Network,
  sender: string,
  gasPrice: number,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModuleResult> => {
  const pactCommand = new PactCommand();
  pactCommand.code = createExp(`describe-module "${moduleName}"`);

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  const response = await pactCommand.local(
    getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId,
    }),
    {
      signatureVerification: false,
      preflight: false,
    },
  );

  const { reqKey, result } = response;

  return {
    reqKey,
    status: result.status,
    code: result.data?.code,
  };
};
