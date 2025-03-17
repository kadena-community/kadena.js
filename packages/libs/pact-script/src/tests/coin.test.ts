import { describe, expect, it } from 'vitest';
import { CoinContract } from '../examples/coin-contract';

describe('coinContract', () => {
  it('TRANSFER', () => {
    const contract = new CoinContract();
    contract.transferCreate('admin', 'alice', 'fake', 1);
    expect(contract.getBalance('alice')).toBe(1);
    contract.transferCreate('alice', 'bob', 'bob-guard', 1);
    expect(contract.getBalance('bob')).toBe(1);
  });

  it('GUARD_MISMATCH', () => {
    const contract = new CoinContract();
    contract.transferCreate('admin', 'alice', 'fake', 1);
    expect(() =>
      contract.transferCreate('admin', 'alice', 'wrong-guard', 1),
    ).toThrow('GUARD_MISMATCH');
  });

  it('INSUFFICIENT_FUND', () => {
    const contract = new CoinContract();
    contract.transferCreate('admin', 'alice', 'fake', 1);
    expect(contract.getBalance('alice')).toBe(1);
    expect(() =>
      contract.transferCreate('alice', 'bob', 'bob-guard', 2),
    ).toThrow('INSUFFICIENT_FUND');
  });
});
