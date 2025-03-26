import { describe, expect, it } from 'vitest';
import { CoinContract } from '../examples/coin-contract';
import { IPactContext, PactContext, pactRunner } from '../fw';

describe('coinContract', () => {
  const env: IPactContext = {
    data: {
      'admin-ks': {
        keys: ['admin-key'],
        pred: 'keys-all',
        signed: true,
        installedCaps: [
          {
            cap: 'coin.TRANSFER',
            args: ['admin', 'alice', 3],
          },
        ],
      },
      'alice-ks': {
        keys: ['alice-key'],
        pred: 'keys-all',
        signed: true,
        installedCaps: [
          {
            cap: 'coin.TRANSFER',
            args: ['alice', 'bob', 1],
          },
        ],
      },
      'bob-ks': {
        keys: ['bob-key'],
        pred: 'keys-all',
      },
    },
  };

  describe('"transfer" and "transferCreate"', () => {
    it('Transfer fails if account is not created', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      expect(() => contract.transfer('admin', 'alice', 1)).toThrow(
        'ACCOUNT_NOT_FOUND',
      );
    });

    it('Creates account and transfer 1 kda form admin to alice using transferCreate', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

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

    it('"transferCreate" with the initial guard works', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      expect(contract.getBalance('alice')).toBe(2);
    });

    it('throws GUARD_MISMATCH if "transferCreate" uses different guard from the initial guard', () => {
      const context = new PactContext(env);
      const contract = pactRunner(new CoinContract(context));

      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      expect(() =>
        contract.transferCreate(
          'admin',
          'alice',
          context.getKeyset('admin-ks'),
          1,
        ),
      ).toThrow('GUARD_MISMATCH');

      expect(contract.getBalance('alice')).toBe(1);
    });

    it('transfers 1 more KDA using "transfer"', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      expect(contract.getBalance('alice')).toBe(1);

      contract.transfer('admin', 'alice', 1);

      expect(contract.getBalance('alice')).toBe(2);
    });

    it('throws exception when transfer calls more that installed', () => {
      // since we installed 3 as max transfer, this should throw
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      expect(() => contract.transfer('admin', 'alice', 4)).toThrow(
        'INSUFFICIENT_FUND',
      );
    });

    it('transfer from alice to bob', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      contract.transferCreate(
        'admin',
        'alice',
        context.getKeyset('alice-ks'),
        1,
      );

      contract.transferCreate('alice', 'bob', context.getKeyset('bob-ks'), 1);

      expect(contract.getBalance('bob')).toBe(1);
      expect(contract.getBalance('alice')).toBe(0);
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

      const contract = CoinContract.create(context);
      contract.changeAdminGuard(context.getKeyset('new-admin-ks'));
    });
  });
});
