import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';

import { faucetNamespace } from '@constants/network.constants';
import { createNamespace } from './deploy/createNamespace';
import { deployFaucet } from './deploy/deployFaucet';
import { fundGasStation } from './deploy/fundGasStation';

export const deployFaucetContract = async (
  chainId: ChainwebChainId,
): Promise<ICommandResult | string> => {
  const upgrade = false;
  await createNamespace({ chainId: chainId, upgrade });
  await deployFaucet({
    chainId: chainId,
    upgrade,
    namespace: faucetNamespace,
  });
  const response = await fundGasStation({
    chainId: chainId,
    upgrade,
  });
  return response.result.status;
};
