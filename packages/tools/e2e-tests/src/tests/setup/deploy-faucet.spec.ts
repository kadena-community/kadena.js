import { expect } from '@playwright/test';
import { test } from '../../page-objects';
import { deployFaucetContract } from '../../smart-contracts/faucet/deploy'

test('Deploy Faucet Contract Chains 0 and 1.', async ({}) => {
  const result = await deployFaucetContract()
  expect(result).toEqual("Write succeeded")
});
