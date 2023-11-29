import { CHAINS } from '@kadena/chainweb-node-client';

import { createAdmin } from './deploy/createAdmin';
import { createNamespace } from './deploy/createNamespace';
import { deployFaucet } from './deploy/deployFaucet';
import { drain } from './deploy/drain';
import { fundAdmin } from './deploy/fundAdmin';
import { fundGasStation } from './deploy/fundGasStation';

const deployInOrder = () => {
  CHAINS.forEach(async (chain) => {
    // Depends on where you're deploying, whether it's a redeploy or not (on Testnet it's not an upgrade, on (a "fresh") DevNet it is)
    const upgrade = false;

    console.log('createAdmin start', chain, upgrade);
    const adminResult = await createAdmin({ chainId: chain, upgrade });
    console.log('createAdmin end', adminResult);

    console.log('createNamespace 1', chain, upgrade);
    const namespaceResult = await createNamespace({ chainId: chain, upgrade });
    console.log('createNamespace 2', namespaceResult);

    console.log('deployFaucet start', chain, upgrade);
    const resultDeploy = await deployFaucet({
      chainId: chain,
      upgrade,
      namespace: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
    });
    console.log('deployFaucet end', resultDeploy);

    console.log('fundGasStation start', chain, upgrade);
    const fundGasStationResult = await fundGasStation({
      chainId: chain,
      upgrade,
    });
    console.log('fundGasStation end', fundGasStationResult);

    // console.log('fundAdmin start', chain, upgrade);
    // const fundAdminResult = await fundAdmin({ chainId: chain, upgrade });
    // console.log('fundAdmin end', fundAdminResult);

    // console.log('drain start', chain, upgrade);
    // const drainResult = await drain({ chainId: chain, upgrade });
    // console.log('drain end', drainResult);
  });
};

deployInOrder();
