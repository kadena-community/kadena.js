import { getBalance } from './helpers/account/describe-account';
import { fundAccount } from './helpers/account/fund-account';
import { executeCrossChainTransfer } from './helpers/transactions/crosschain-transaction';
import { IAccount } from './helpers/interfaces';

import { expect } from '@jest/globals';

const sourceAccount: IAccount = {
  account: 'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
  publicKey: '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
  chainId: '0',
};

const targetAccount: IAccount = {
  account: 'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e12',
  publicKey: '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e12',
  chainId: '1',
};

describe('Cross Chain Transfer', () => {
  it('should have a source account on chain 0', async () => {
    const result = await fundAccount(
      sourceAccount.account,
      sourceAccount.publicKey,
      { decimal: '100' },
      sourceAccount.chainId,
    );
    expect(result).toBe('success');
    const balance = await getBalance(
      sourceAccount.account,
      sourceAccount.chainId,
    );
    expect(balance).toBeGreaterThanOrEqual(0);
  });
  it('should have a target account on chain 1', async () => {
    const result = await fundAccount(
      targetAccount.account,
      targetAccount.publicKey,
      { decimal: '100' },
      targetAccount.chainId,
    );
    expect(result).toBe('success');
    const balance = await getBalance(
      sourceAccount.account,
      sourceAccount.chainId,
    );
    expect(balance).toBeGreaterThanOrEqual(0);
  });
  it('should be able to perform a cross chain transfer', async () => {
    //await executeCrossChainTransfer(sourceAccount, targetAccount, '5');
  });
  it('Should have deducted balance from the source account ', async () => {
    console.log('This one is TODO');
  });
  it('Should have added balance to the target account ', async () => {
    console.log('This one is TODO');
  });
});
