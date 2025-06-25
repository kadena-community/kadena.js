import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getGuard, getKeyset, getPubkeyFromAccount } from '../getPubKey';

describe('getPubKey utils', () => {
  describe('getPubkeyFromAccount', () => {
    it('should return the correct pubkey from the object', () => {
      const result = getPubkeyFromAccount({
        alias: 'Account 1',
        publicKey:
          'cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
        address:
          'k:cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
        guard: {
          keys: [
            'cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
          ],
          pred: 'keys-all',
        },
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        keyset: {
          keys: [
            'cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
          ],
          pred: 'keys-all',
        },
        walletName: 'CHAINWEAVER',
      });

      expect(result).toEqual(
        'cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
      );
    });
    it('should return undefined when the pupkey is not there', () => {
      const result = getPubkeyFromAccount({
        alias: 'Account 1',
        address:
          'k:cd75b4afbb3e8e2fd14c5fbd7b4bfb96384f60708a6a45f82e0ffebb570e79e1',
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        guard: { keys: [], pred: 'keys-all' },
        keyset: { keys: [], pred: 'keys-all' },
        walletName: 'CHAINWEAVER',
      } as unknown as IWalletAccount);
      expect(result).toEqual(undefined);
    });
  });

  describe('getGuard', () => {
    it('should return the guard if it is a keyset or keyset ref', () => {
      const account: IWalletAccount = {
        alias: 'Account 1',
        publicKey: 'pubkey1',
        address: 'k:pubkey1',
        guard: { keys: ['pubkey1'], pred: 'keys-all' },
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        keyset: { keys: ['pubkey1'], pred: 'keys-all' },
        walletName: 'CHAINWEAVER',
      };
      const result = getGuard(account);
      expect(result).toEqual(account.guard);
    });

    it('should return undefined if guard is not a keyset or keyset ref', () => {
      const account: IWalletAccount = {
        alias: 'Account 1',
        publicKey: 'pubkey1',
        address: 'k:pubkey1',
        guard: { foo: 'bar' } as any, // purposely invalid
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        keyset: { keys: ['pubkey1'], pred: 'keys-all' },
        walletName: 'CHAINWEAVER',
      };
      const result = getGuard(account);
      expect(result).toBeUndefined();
    });
  });

  describe('getKeyset', () => {
    it('should return the keyset from the account', () => {
      const account: IWalletAccount = {
        alias: 'Account 1',
        publicKey: 'pubkey1',
        address: 'k:pubkey1',
        guard: { keys: ['pubkey1'], pred: 'keys-all' },
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        keyset: { keys: ['pubkey1'], pred: 'keys-all' },
        walletName: 'CHAINWEAVER',
      };
      const result = getKeyset(account);
      expect(result).toEqual(account.keyset);
    });

    it('should return undefined if keyset is not present', () => {
      const account = {
        alias: 'Account 1',
        publicKey: '',
        address: 'k:pubkey1',
        guard: { keys: ['pubkey1'], pred: 'keys-all' },
        contract: 'coin',
        chains: [],
        overallBalance: '0',
        walletName: 'CHAINWEAVER',
      } as unknown as IWalletAccount;
      const result = getKeyset(account);
      expect(result).toBeUndefined();
    });
  });
});
