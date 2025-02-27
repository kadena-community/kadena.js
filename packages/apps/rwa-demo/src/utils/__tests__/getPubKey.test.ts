import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getPubkeyFromAccount } from '../getPubKey';

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
      } as any as IWalletAccount);

      expect(result).toEqual(undefined);
    });
  });
});
