import { describe, expect, it } from 'vitest';
import { walletSdk } from '../walletSdk.js';

describe('getFungibleAccountsByPublicKey', () => {
  /**
   * Tests for fungable accounts by publickey
   */
  describe('Graph', () => {
    it('fetches fungible accounts correctly with valid inputs', async () => {
      const publicKey =
        '232d28fe92059876b5febb69e7e10a92e46e844697d9643dfdef7d61eec06359';
      const fungibleName = 'coin';
      const networkId = 'testnet04';

      const result = await walletSdk.getFungibleAccountsByPublicKey({
        publicKey,
        fungibleName,
        networkId,
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

    it('fetches multiple fungible accounts correctly with valid inputs', async () => {
      const publicKey =
        '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
      const fungibleName = 'coin';
      const networkId = 'testnet04';

      const result = await walletSdk.getFungibleAccountsByPublicKey({
        publicKey,
        fungibleName,
        networkId,
      });

      const expectedAccounts = [
        {
          accountName:
            'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          chainAccounts: [
            {
              accountName:
                'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
              chainId: '0',
            },
            {
              accountName:
                'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
              chainId: '1',
            },
            {
              accountName:
                'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
              chainId: '2',
            },
            {
              accountName:
                'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
              chainId: '5',
            },
            {
              accountName:
                'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
              chainId: '8',
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

      const result = await walletSdk.getFungibleAccountsByPublicKey({
        publicKey,
        fungibleName,
        networkId,
      });
      expect(result.fungibleAccounts).toEqual([]);
    });
  });
});
