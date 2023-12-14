import type { ICommandResult } from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';

import { NAMESPACE } from './deploy/constants';
import { createNamespace } from './deploy/createNamespace';
import { deployFaucet } from './deploy/deployFaucet';
import { fundGasStation } from './deploy/fundGasStation';

export const deployFaucetContract = async (): Promise<string | undefined | ICommandResult> =>{
    for (const chain of CHAINS.slice(0,2)) {
      // Depends on where you're deploying, whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
      const upgrade = false;
      // await createAdmin({ chainId: chain, upgrade });
      await createNamespace({ chainId: chain, upgrade });
      await deployFaucet({
        chainId: chain,
        upgrade,
        namespace: NAMESPACE,
      });
      const fundGasStationResult = await fundGasStation({
        chainId: chain,
        upgrade,
      });
      return fundGasStationResult;

      // console.log('fundAdmin start', chain, upgrade);
      // const fundAdminResult = await fundAdmin({ chainId: chain, upgrade });
      // console.log('fundAdmin end', fundAdminResult);

      // console.log('drain start', chain, upgrade);
      // const drainResult = await drain({ chainId: chain, upgrade });
      // console.log('drain end', drainResult);
    };
}
