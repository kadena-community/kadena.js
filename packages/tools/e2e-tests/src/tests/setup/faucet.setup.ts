import { expect, test as setup } from '@playwright/test';
import { deployFaucetContract } from 'src/support/smart-contracts/faucet/deploy';
import { deployGuards } from '../../support/smart-contracts/guards/deploy';
import { deployGasStation } from '../../support/smart-contracts/kadena-xchain-gas/deploy';

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
