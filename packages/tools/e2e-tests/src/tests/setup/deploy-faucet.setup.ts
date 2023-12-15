import { expect } from '@playwright/test';
import { test as setup } from '../../fixtures/page-obects.fixture';
import { deployFaucetContract } from '../../smart-contracts/faucet/deploy';

setup('Deploy Faucet Smart Contract', async () => {
  await setup.step('Deploying on Chain 0', async () => {
    expect(await deployFaucetContract('0')).toEqual('success');
  });
  await setup.step('Deploying on Chain 1', async () => {
    expect(await deployFaucetContract('1')).toEqual('success');
  });
});
