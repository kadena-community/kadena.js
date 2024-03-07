import { deployFaucetContract } from '@kadena-dev/e2e-base/src/smart-contracts/faucet/deploy';
import { deployGuards } from '@kadena-dev/e2e-base/src/smart-contracts/guards/deploy';
import { deployGasStation } from '@kadena-dev/e2e-base/src/smart-contracts/kadena-xchain-gas/deploy';
import { expect, test as setup } from '@playwright/test';

setup('Configure Devnet', async () => {
  await setup.step(
    'Deploy Guards Contracts & Gas Station on chain 0',
    async () => {
      await deployGuards('0');
      await deployGasStation('0');
    },
  );
  await setup.step(
    'Deploy Guards Contracts & Gas Station on chain 1',
    async () => {
      await deployGuards('1');
      await deployGasStation('1');
    },
  );

  await setup.step('Deploy Faucet Contract on chain 0', async () => {
    const deploymentStatus = await deployFaucetContract('0');
    expect(deploymentStatus).toEqual('success');
  });
  await setup.step('Deploy Faucet Contract on chain 1', async () => {
    const deploymentStatus = await deployFaucetContract('1');
    expect(deploymentStatus).toEqual('success');
  });
});
