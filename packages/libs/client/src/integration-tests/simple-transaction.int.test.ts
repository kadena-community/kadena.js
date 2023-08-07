import { getBalance } from './helpers/account/describe-account';
import { fundAccount } from './helpers/account/fund-account';
import { IAccount } from './helpers/interfaces';
import { executeCrossChainTransfer } from './helpers/transactions/crosschain-transaction';

import { expect } from '@jest/globals';

const sourceAccount: IAccount = {
  account: 'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
  publicKey: 'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
  chainId: '0',
  guard: 'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
};
const targetAccount: IAccount = {
  account: 'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
  publicKey: 'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
  chainId: '1',
  guard: 'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
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
    expect(balance).toBeGreaterThanOrEqual(100);
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
    expect(balance).toBeGreaterThanOrEqual(100);
  });
  it('should be able to perform a cross chain transfer', async () => {
    await executeCrossChainTransfer(sourceAccount, targetAccount, '5');
  });
  it('Should have deducted balance from the source account ', async () => {
    console.log('This one is TODO');
  });
  it('Should have added balance to the target account ', async () => {
    console.log('This one is TODO');
  });
});
