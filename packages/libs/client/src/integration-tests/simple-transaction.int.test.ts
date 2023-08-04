import { getBalance } from './helpers/describe-account';
import { fundAccount } from './helpers/fund-account';
import { expect } from '@jest/globals';

const account =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';
const accountKey =
  '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';
const chainId = '1';
let balance: number;


beforeAll(async () => {
  const result = await fundAccount(
    account,
    accountKey,
    { decimal: '100' },
    chainId,
  );
  expect(result).toBe('success');
  balance = await getBalance(account, chainId);
  expect(balance).toBeGreaterThanOrEqual(0);
});

describe('Simple Transaction', () => {
  it('should perform a simple transfer', async () => {
    const newBalance = await getBalance(account, chainId);
    expect(newBalance).toBe(balance);
  });
});
