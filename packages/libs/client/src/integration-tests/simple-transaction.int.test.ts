import { getBalance } from './util/describe-account';
import { fund } from './util/simple-transfer';

import { expect } from '@jest/globals';

const account =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';
const accountKey =
  '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11s';
const chainId = '1';
let balance: number;

describe('Simple Transaction', () => {
  beforeAll(async () => {
    await fund(account, accountKey, { decimal: '100' }, chainId);
    balance = await getBalance(account, chainId);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('should perform a simple transfer', async () => {
    const newBalance = await getBalance(account, chainId);
    expect(newBalance).toBe(balance);
  }, 100000);
});
