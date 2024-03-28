import { CHAINS } from '@kadena/chainweb-node-client';

import { NAMESPACE } from './constants';
import { createAdmin } from './createAdmin';
import { createNamespace } from './createNamespace';
import { deployFaucet } from './faucet';
import { drain } from './drain';
import { fundAdmin } from './fundAdmin';
import { fundGasStation } from './fundGasStation';

const deployInOrder = () => {
  const copyChains = [...CHAINS];
  copyChains.splice(0, 1).forEach(async (chain) => {
    // Depends on where you're deploying, whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
    const upgrade = false;

    // console.log('createAdmin start', chain, upgrade);
    // const adminResult = await createAdmin({ chainId: chain, upgrade });
    // console.log('createAdmin end', adminResult);

    console.log('createNamespace 1', chain, upgrade);
    const namespaceResult = await createNamespace({ chainId: chain, upgrade });
    console.log('createNamespace 2', namespaceResult);

    console.log('deployFaucet start', chain, upgrade);
    const resultDeploy = await deployFaucet({
      chainId: chain,
      upgrade,
      namespace: NAMESPACE,
    });
    console.log('deployFaucet end', resultDeploy);

    console.log('fundGasStation start', chain, upgrade);
    const fundGasStationResult = await fundGasStation({
      chainId: chain,
      upgrade,
    });
    console.log('fundGasStation end', fundGasStationResult);
  });
};

