import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { generateApiHost } from '@/services/utils/utils';

const gasLimit: number = 60000;
const gasPrice: number = 0.00000001;
const ttl: number = 60000;
const sender = 'not-real';

export interface ModuleResult {
  reqKey?: string;
  status?: string;
  code?: string;
}

export const describeModule = async (
  moduleName: string,
  chainId: ChainId,
  networkId: string,
): Promise<ModuleResult> => {
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
