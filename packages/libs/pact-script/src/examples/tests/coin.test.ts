import { describe, expect, it } from 'vitest';
import { IPactContext, PactContext, pactRunner } from '../../fw';
import { CoinContract } from '../coin-contract';
import { MyCoin } from '../my-coin';

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

    it('TransferCreate fails if account name is reserved', () => {
      const context = new PactContext(env);
      const contract = CoinContract.create(context);

      expect(() =>
        contract.transferCreate(
          'admin',
          // this is against the reserved protocol
          'k:alice',
          context.getKeyset('alice-ks'),
          1,
        ),
      ).toThrow('INVALID ACCOUNT');
    });

    it('TransferCreate works if account name is valid', () => {
      const context = new PactContext({
        data: {
          'admin-ks': {
            keys: ['admin-key'],
            pred: 'keys-all',
            signed: true,
            installedCaps: [
              {
                cap: 'coin.TRANSFER',
                args: ['admin', 'k:alice-key:keys-all', 1],
              },
            ],
          },
          'alice-ks': {
            keys: ['alice-key'],
            pred: 'keys-all',
          },
        },
      });
      const contract = CoinContract.create(context);

      expect(
        contract.transferCreate(
          'admin',
          'k:alice-key:keys-all',
          context.getKeyset('alice-ks'),
          1,
        ),
      ).toBe(true);
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
        'REACHED_MAX_ALLOWED',
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

  describe('CROSS_CHAIN', () => {
    it('burns the token in the source chain', () => {
      const chainOneContext = new PactContext({
        ...env,
        meta: {
          chainId: '1',
        },
      });
      const chainOneContract = CoinContract.create(chainOneContext);
      // account admin is created with 1000000 KDA
      expect(chainOneContract.getBalance('admin')).toBe(1000000);
      const proof = chainOneContract.crossChain(
        'admin',
        'alice',
        chainOneContext.getKeyset('alice-ks'),
        1,
        '2',
      );
      // the token is burned in the source chain
      expect(chainOneContract.getBalance('admin')).toBe(999999);

      // alice's account is not created in the destination chain
      expect(() => chainOneContract.getBalance('alice')).toThrow(
        'ACCOUNT_NOT_FOUND',
      );
      expect(proof).toBeTruthy();

      const chainTwoContext = new PactContext({
        ...env,
        meta: {
          chainId: '2',
        },
      });
      const chainTwoContract = CoinContract.create(chainTwoContext);
      const result = chainTwoContract.continue(proof);
      expect(result).toBe(true);
      // alice's account is created in the destination chain and has 1 KDA
      expect(chainTwoContract.getBalance('alice')).toBe(1);
    });
  });
});
describe('my-coin', () => {
  describe('transfer', () => {
    it('fails if module name in installed capabilities is not my-coin', () => {
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
        },
      };

      const context = new PactContext(env);
      const contract = MyCoin.create(context);

      expect(
        () =>
          contract.transferCreate(
            'admin',
            // this is against the reserved protocol
            'alice',
            context.getKeyset('alice-ks'),
            1,
          ),
        // error contains the capability that is not installed
      ).toThrow(/CAPABILITY_NOT_INSTALLED.*my-coin.TRANSFER/);
    });
  });
  describe('CHANGE_GUARD', () => {
    it('throws exception for my-coin contract', () => {
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
      context.sign('admin-ks');

      const contract = MyCoin.create(context);
      expect(() =>
        contract.changeAdminGuard(context.getKeyset('new-admin-ks')),
      ).toThrow('NOT_CHANGEABLE');
    });
  });
});
