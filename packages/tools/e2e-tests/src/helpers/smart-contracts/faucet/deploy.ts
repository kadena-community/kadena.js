//import { CHAINS } from '@kadena/chainweb-node-client';
import { createAdmin } from './deploy/createAdmin';
import { deployFaucet } from './deploy/deployFaucet';
import { fundFaucet } from './deploy/fundFaucet';
import { rotateKeyset } from './deploy/rotate-keyset';

export class FaucetContract {
  public constructor() {}

  async deployInOrder(): Promise<void> {
    const chain = '0';
    const upgrade = false; // Depends on where you're deploying, whether it's a redeploy or not

    console.log('createAdmin', chain, upgrade);
    await createAdmin({ chainId: chain, upgrade });

    // console.log('fundAdmin', chain, upgrade);
    // await fundAdmin({ chainId: chain, upgrade });

    console.log('deployFaucet', chain, upgrade);
    await deployFaucet({ chainId: chain, upgrade });

    console.log('fundFaucet', chain, upgrade);
    await fundFaucet({ chainId: chain, upgrade });

    console.log('rotateKeyset', chain, upgrade);
    await rotateKeyset('faucet-operation', chain);
  }
}
