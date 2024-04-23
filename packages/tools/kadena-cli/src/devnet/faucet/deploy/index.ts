import type { ChainId } from '@kadena/types';
import { NAMESPACE } from './constants.js';
import { createNamespace } from './createNamespace.js';
import { deployFaucet } from './faucet.js';
import { fundGasStation } from './fundGasStation.js';

export default async function deployDevNetFaucet(
  chainId: ChainId,
  upgrade = false,
): Promise<void | undefined> {
  try {
    await createNamespace({
      chainId,
      upgrade,
    });

    await deployFaucet({
      chainId,
      upgrade,
      namespace: NAMESPACE,
    });

    await fundGasStation({
      chainId,
      upgrade,
    });
  } catch (error) {
    throw Error(error);
  }
}
