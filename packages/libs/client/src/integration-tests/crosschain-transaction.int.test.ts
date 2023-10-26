import { describe, expect, it } from 'vitest';
import { getBalance } from './helpers/account/describe-account';
import { fundAccount } from './helpers/account/fund-account';
import { executeCrossChainTransfer } from './helpers/transactions/crosschain-transaction';
import { sourceAccount, targetAccount } from './test-data/accounts';

let initialSourceBalance: number;
let initialTargetBalance: number;

describe('Cross Chain Transfer', () => {
  it('should fund the source account on chain 0', async () => {
    const result = await fundAccount(
      sourceAccount.account,
      sourceAccount.publicKey,
      { decimal: '100' },
      sourceAccount.chainId,
    );
    expect(result).toBe('success');
    initialSourceBalance = await getBalance(sourceAccount.account, '0');
    expect(initialSourceBalance).toBeGreaterThanOrEqual(100);
  });

  // this is required as the source account is used to pay for gas;
  // in mainnet this is not required as the gas station pays for gas
  it('should fund the source account on chain 1', async () => {
    const result = await fundAccount(
      sourceAccount.account,
      sourceAccount.publicKey,
      { decimal: '100' },
      // because we need to pay gas fee on the target chain
      targetAccount.chainId,
    );
    expect(result).toBe('success');
    initialTargetBalance = await getBalance(sourceAccount.account, '1');
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
