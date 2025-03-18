import { describe, expect, it } from 'vitest';
import { CoinContract } from '../examples/coin-contract';
import { IPactContext, PactContext } from '../examples/fw';

describe('coinContract', () => {
  const env: IPactContext = {
    data: {
      'admin-ks': {
        keys: ['admin-key'],
        pred: 'keys-all',
      },
      'alice-ks': {
        keys: ['alice-key'],
        pred: 'keys-all',
      },
      'bob-ks': {
        keys: ['bob-key'],
        pred: 'keys-all',
      },
    },
  };

  it('TRANSFER', () => {
    const context = new PactContext(env).sign('admin-ks').sign('alice-ks');
    const contract = new CoinContract(context);

    expect(
      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      ),
    ).toBe(true);

    expect(contract.getBalance('alice')).toBe(1);

    contract.transferCreate('admin', 'alice', context.getKeyset('alice-ks'), 1);

    expect(contract.getBalance('alice')).toBe(2);

    expect(() =>
      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('admin-ks'),
        1,
      ),
    ).toThrow('GUARD_MISMATCH');

    contract.transfer('admin', 'alice', 1);
    expect(contract.getBalance('alice')).toBe(3);

    contract.transferCreate('alice', 'bob', context.getKeyset('bob-ks'), 1);
    expect(contract.getBalance('bob')).toBe(1);
    expect(contract.getBalance('alice')).toBe(2);
  });

  describe('CHANGE_GUARD', () => {
    it('should change the admin guard', () => {
      const env: IPactContext = {
        data: {
          'admin-ks': {
            keys: ['admin-key'],
            pred: 'keys-all',
          },
          'new-admin-ks': {
            keys: ['new-admin-key'],
            pred: 'keys-all',
          },
          'fake-admin-ks': {
            keys: ['fake-admin-key'],
            pred: 'keys-all',
          },
        },
      };

      const context = new PactContext(env);
      context.sign('admin-ks', [
        {
          cap: 'CHANGE_ADMIN_GUARD',
          args: [context.getKeyset('new-admin-ks')],
        },
      ]);

      const contract = new CoinContract(context);
      contract.changeAdminGuard(context.getKeyset('new-admin-ks'));
    });

    it('should throw if cap is not installed', () => {
      const env: IPactContext = {
        data: {
          'admin-ks': {
            keys: ['admin-key'],
            pred: 'keys-all',
          },
          'new-admin-ks': {
            keys: ['new-admin-key'],
            pred: 'keys-all',
          },
        },
      };

      const context = new PactContext(env);
      context.sign('admin-ks', [
        {
          cap: 'CHANGE_ADMIN_GUARD_WRONG',
          args: [context.getKeyset('new-admin-ks')],
        },
      ]);

      const contract = new CoinContract(context);
      expect(() =>
        contract.changeAdminGuard(context.getKeyset('new-admin-ks')),
      ).toThrow('CAPABILITY_NOT_INSTALLED');
    });
  });

  // it('GUARD_MISMATCH', () => {
  //   const contract = new CoinContract();
  //   contract.transferCreate('admin', 'alice', 'fake', 1);
  //   expect(() =>
  //     contract.transferCreate('admin', 'alice', 'wrong-guard', 1),
  //   ).toThrow('GUARD_MISMATCH');
  // });

  // it('INSUFFICIENT_FUND', () => {
  //   const contract = new CoinContract();
  //   contract.transferCreate('admin', 'alice', 'fake', 1);
  //   expect(contract.getBalance('alice')).toBe(1);
  //   expect(() =>
  //     contract.transferCreate('alice', 'bob', 'bob-guard', 2),
  //   ).toThrow('INSUFFICIENT_FUND');
  // });
});
