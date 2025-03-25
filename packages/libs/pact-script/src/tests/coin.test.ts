import { describe, expect, it } from 'vitest';
import { CoinContract } from '../examples/coin-contract';
import { IPactContext, PactContext, createPactContract } from '../examples/fw';

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

  describe('"transfer" and "transferCreate"', () => {
    const context = new PactContext(env)
      .sign('admin-ks', [
        {
          cap: 'TRANSFER',
          args: ['admin', 'alice', 3],
        },
      ])
      .sign('alice-ks', [
        {
          cap: 'TRANSFER',
          args: ['alice', 'bob', 1],
        },
      ]);

    const contract = createPactContract(new CoinContract(context));

    it('Transfer fails if account is not created', () => {
      expect(() => contract.transfer('admin', 'alice', 1)).toThrow(
        'ACCOUNT_NOT_FOUND',
      );
    });

    it('Creates account and transfer 1 kda form admin to alice using transferCreate', () => {
      expect(
        contract.transferCreate(
          'admin',
          'alice',
          context.getKeyset('alice-ks'),
          1,
        ),
      ).toBe(true);

      expect(contract.getAccountDetails('alice').guard.principal).toBe(
        context.getKeyset('alice-ks').principal,
      );

      expect(contract.getBalance('alice')).toBe(1);
    });

    it('Transfers 1 more kda form admin to alice via "transferCreate" with the same guard', () => {
      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      expect(contract.getBalance('alice')).toBe(2);
    });

    it('throws GUARD_MISMATCH if "transferCreate" uses different guard from the initial guard', () => {
      expect(() =>
        contract.transferCreate(
          'admin',
          'alice',
          context.getKeyset('admin-ks'),
          1,
        ),
      ).toThrow('GUARD_MISMATCH');
    });

    it('transfers 1 more KDA using "transfer"', () => {
      expect(contract.getBalance('alice')).toBe(2);
      contract.transfer('admin', 'alice', 1);
    });

    it('throws exception when transfer calls more that installed', () => {
      // since we installed 3 as max transfer, this should throw
      expect(() => contract.transfer('admin', 'alice', 1)).toThrow(
        'INSUFFICIENT_FUND',
      );
    });

    it('transfer from alice to bob', () => {
      contract.transferCreate('alice', 'bob', context.getKeyset('bob-ks'), 1);
      expect(contract.getBalance('bob')).toBe(1);
      expect(contract.getBalance('alice')).toBe(2);
    });
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
      context.sign('admin-ks');

      const contract = createPactContract(new CoinContract(context));
      contract.changeAdminGuard(context.getKeyset('new-admin-ks'));
    });
  });
});
