import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { createExp } from '@kadena/pactjs';

import { kadenaConstants } from '@/constants/kadena';

//List modules PACT code example

export const listModules = async (
  networkId: string = kadenaConstants.TESTNET.NETWORKS.TESTNET04,
  chainId: string = '1',
  gasPrice: number,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
) => {
  // 1 - Create a new PactCommand
  const pactCommand = new PactCommand();

  // 2 - Bind to the Pact code
  pactCommand.code = createExp('list-modules');

  // 3 - Set the meta data
  pactCommand.setMeta(
    { gasLimit, gasPrice, ttl },
    networkId as ChainwebNetworkId,
  );

  // 4 - Call the Pact local endpoint to retrieve the result
  return await pactCommand.local(
    kadenaConstants.TESTNET.API_HOST({ networkId, chainId }),
  );
};
