import { FaucetContract } from '../../helpers/smart-contracts/faucet/deploy';
import { test } from '../../page-objects';

test.only('Deploy Contract to DEVNET', async ({}) => {
  const smartContractHelper = new FaucetContract();
  await smartContractHelper.deployInOrder();
});
