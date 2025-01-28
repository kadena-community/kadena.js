import { describe, expect, it } from 'vitest';
import { walletSdk } from '../walletSdk.js';

describe('getFungibleAccountsByPublicKey', () => {
  /**
   * Tests for Hackachain GraphType
   */
  describe('Hackachain GraphType', () => {
    it('fetches fungible accounts correctly with valid inputs', async () => {
      const publicKey =
        '232d28fe92059876b5febb69e7e10a92e46e844697d9643dfdef7d61eec06359';
      const fungibleName = 'coin';
      const networkId = 'testnet04';
      const graphType = 'hackachain';

      const result = await walletSdk.getFungibleAccountsByPublicKey({
        publicKey,
        fungibleName,
        networkId,
        graphType,
      });

      const expectedAccounts = [
        {
          accountName:
            'k:232d28fe92059876b5febb69e7e10a92e46e844697d9643dfdef7d61eec06359',
          chainAccounts: [
            {
              accountName:
                'k:232d28fe92059876b5febb69e7e10a92e46e844697d9643dfdef7d61eec06359',
              chainId: '2',
            },
          ],
        },
      ];
      expect(result.fungibleAccounts).toEqual(expectedAccounts);
    });

    it('returns an empty array when no accounts are found', async () => {
      const publicKey = 'nonexistentpublickey1234567890';
      const fungibleName = 'coin';
      const networkId = 'testnet04';
      const graphType = 'hackachain';

      const result = await walletSdk.getFungibleAccountsByPublicKey({
        publicKey,
        fungibleName,
        networkId,
        graphType,
      });
      expect(result.fungibleAccounts).toEqual([]);
    });
  });
});
