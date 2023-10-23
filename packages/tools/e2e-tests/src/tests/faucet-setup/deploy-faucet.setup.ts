import { test as setup } from '@playwright/test';
import { FaucetContract } from '../../helpers/smart-contracts/faucet/deploy';

setup('Deploy Faucet Contract Chains 0 and 1.', async ({}) => {
  const smartContractHelper = new FaucetContract();
  await smartContractHelper.deployInOrder('0');
  await smartContractHelper.deployInOrder('1');
});
