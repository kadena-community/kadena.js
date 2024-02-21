import { deployFaucetContract } from '@devnet/faucet/deploy';
import { deployGuards } from '@devnet/guards/deploy';
import { deployGasStation } from '@devnet/kadena-xchain-gas/deploy';
import { test as setup } from '@fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

setup('Configure Devnet For Tools', async () => {
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
