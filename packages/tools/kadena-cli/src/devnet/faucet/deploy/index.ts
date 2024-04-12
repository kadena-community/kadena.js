import type { ChainId } from '@kadena/types';
import { NAMESPACE } from './constants.js';
import { createNamespace } from './createNamespace.js';
import { deployFaucet } from './faucet.js';
import { fundGasStation } from './fundGasStation.js';

export default async function deployDevNetFaucet(
  chainIds: ChainId[],
  upgrade = false,
): Promise<void | undefined> {
  try {
    for (const chain of chainIds) {
      await createNamespace({
        chainId: chain,
        upgrade,
      });

      await deployFaucet({
        chainId: chain,
        upgrade,
        namespace: NAMESPACE,
      });

      await fundGasStation({
        chainId: chain,
        upgrade,
      });
    }
  } catch (error) {
    throw Error(error);
  }
}
