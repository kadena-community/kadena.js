import { expect, test as setup } from '@playwright/test';
import { deployFaucetContract } from '../../smart-contracts/faucet/deploy';

setup('Deploy Faucet Smart Contract', async () => {
  await setup.step('Deploying on Chain 0', async () => {
    const deploymentStatus = await deployFaucetContract('0')
    expect(deploymentStatus).toEqual('success');
  });
  await setup.step('Deploying on Chain 1', async () => {
    const deploymentStatus = await deployFaucetContract('1')
    expect(deploymentStatus).toEqual('success');
  });
});
