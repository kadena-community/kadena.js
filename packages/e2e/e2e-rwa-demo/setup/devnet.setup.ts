import { deployFaucetContract } from '@kadena-dev/e2e-base/src/smart-contracts/faucet/deploy';
import { deployGuards } from '@kadena-dev/e2e-base/src/smart-contracts/guards/deploy';
import { deployGasStation } from '@kadena-dev/e2e-base/src/smart-contracts/kadena-xchain-gas/deploy';
import { expect, test as setup } from '@playwright/test';

setup('Deploy kadena-xchain-gas-station', async () => {
  await setup.step(
    'Deploy Guards Contracts & Gas Station on chain 0',
    async () => {
      await deployGuards('0');
      const deploymentStatus = await deployGasStation('0');
      expect(deploymentStatus.result.status).toBeDefined();
    },
  );
});

setup('Deploy Faucet', async () => {
  await setup.step('Deploy Faucet Contract on chain 0', async () => {
    const deploymentStatus = await deployFaucetContract('0');
    expect(deploymentStatus).toEqual('success');
  });
});
