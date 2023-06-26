import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { kadenaConstants } from '@/constants/kadena';
import { generateApiHost } from '@/services/utils/utils';

export interface IModuleResult {
  reqKey?: string;
  status?: string;
  code?: string;
}

export const describeModule = async (
  moduleName: string,
  chainId: ChainId,
  networkId: string,
  sender: string,
  gasPrice: number,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModuleResult> => {
  const pactCommand = new PactCommand();
  pactCommand.code = createExp(`describe-module "${moduleName}"`);

  pactCommand.setMeta({ gasLimit, gasPrice, ttl, sender, chainId });

  const response = await pactCommand.local(
    generateApiHost(networkId, chainId),
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
