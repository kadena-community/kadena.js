import type { ChainId } from '@kadena/types';
import { NAMESPACE } from './constants.js';
import { createNamespace } from './createNamespace.js';
import { deployFaucet } from './faucet.js';
import { fundGasStation } from './fundGasStation.js';

export default async function deployDevNetFaucet(
  chainIds: [ChainId],
): Promise<void | undefined> {
  try {
    chainIds.forEach(async (chain) => {
      // Depends on where you're deploying,
      // whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
      const upgrade = false;

      console.log('Start creating a namespace... ', chain, upgrade);

      const namespaceResult = await createNamespace({
        chainId: chain,
        upgrade,
      });

      console.log('Namespace created successfully', namespaceResult);

      console.log('Start deploying faucet...', chain, upgrade);

      const resultDeploy = await deployFaucet({
        chainId: chain,
        upgrade,
        namespace: NAMESPACE,
      });

      console.log('faucet deployed successfully', resultDeploy);

      console.log('Start funding gas station...', chain, upgrade);

      const fundGasStationResult = await fundGasStation({
        chainId: chain,
        upgrade,
      });
      console.log(
        'funding gas station completed successfully.',
        fundGasStationResult,
      );
    });
  } catch (error) {
    console.error('Error during deployment', error);
    throw error;
  }
}
