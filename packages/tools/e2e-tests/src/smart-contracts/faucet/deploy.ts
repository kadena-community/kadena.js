import type { ChainwebChainId} from '@kadena/chainweb-node-client';

import { NAMESPACE } from './deploy/constants';
import { createNamespace } from './deploy/createNamespace';
import { deployFaucet } from './deploy/deployFaucet';
import { fundGasStation } from './deploy/fundGasStation';

export const deployFaucetContract = async (
  chainId: ChainwebChainId): Promise<string> =>{
      // Depends on where you're deploying, whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
      const upgrade = false;
      // await createAdmin({ chainId: chain, upgrade });
      await createNamespace({ chainId: chainId, upgrade });
      await deployFaucet({
        chainId: chainId,
        upgrade,
        namespace: NAMESPACE,
      });
      const fundGasStationResult = await fundGasStation({
        chainId: chainId,
        upgrade,
      });
      return fundGasStationResult.result.status;
};
