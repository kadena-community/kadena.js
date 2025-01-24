import { expect, test as setup } from '@playwright/test';
import { deployRWA } from './../../e2e-base/src/smart-contracts/rwa/deploy';

setup('RWA contract', async () => {
  await setup.step('Deploy rwa contract', async () => {
    setup.setTimeout(480_000);
    const deploymentStatus = await deployRWA();
    await expect(deploymentStatus).toEqual(true);
  });
});
