import { getBalance } from './helpers/account/describe-account';
import { fundAccount } from './helpers/account/fund-account';
import { executeCrossChainTransfer } from './helpers/transactions/crosschain-transaction';
import { sourceAccount, targetAccount } from './test-data/accounts';

import { expect } from '@jest/globals';

let initialSourceBalance: number;
let initialTargetBalance: number;

describe('Cross Chain Transfer', () => {
  it('should have a source account on chain 0', async () => {
    const result = await fundAccount(
      sourceAccount.account,
      sourceAccount.publicKey,
      { decimal: '100' },
      sourceAccount.chainId,
    );
    expect(result).toBe('success');
    initialSourceBalance = await getBalance(
      sourceAccount.account,
      sourceAccount.chainId,
    );
    expect(initialSourceBalance).toBeGreaterThanOrEqual(100);
  });
  it('should have a target account on chain 1', async () => {
    const result = await fundAccount(
      targetAccount.account,
      targetAccount.publicKey,
      { decimal: '100' },
      targetAccount.chainId,
    );
    expect(result).toBe('success');
    initialTargetBalance = await getBalance(
      targetAccount.account,
      targetAccount.chainId,
    );
    expect(initialTargetBalance).toBeGreaterThanOrEqual(100);
  });
  it('should be able to perform a cross chain transfer', async () => {
    await executeCrossChainTransfer(sourceAccount, targetAccount, '5');
  });
  it('Should have deducted balance from the source account ', async () => {
    const newBalance = await getBalance(
      sourceAccount.account,
      sourceAccount.chainId,
    );
    expect(newBalance).toBeLessThan(initialSourceBalance - 5);
  });
  it('Should have added balance to the target account ', async () => {
    initialTargetBalance = await getBalance(
      targetAccount.account,
      targetAccount.chainId,
    );
    //Even though we transferred 5 KDA, we have to pay for gas.
    expect(initialTargetBalance).toBeGreaterThanOrEqual(100 + 4.9);
  });
});
