import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '../coin';
import { sender00Account, sourceAccount } from './test-data/accounts';

describe('coin module', () => {
  describe('transfer', () => {
    it('should transfer funds from sender00 account to sourceAccount', async () => {
      const result = await transferCreate(
        {
          sender: {
            account: sender00Account.account,
            publicKeys: [sender00Account.publicKey],
          },
          receiver: {
            account: sourceAccount.account,
            keyset: {
              keys: [sourceAccount.publicKey],
              pred: 'keys-all',
            },
          },
          amount: '100',
          chainId: '0',
        },
        {
          host: 'http://localhost:8080',
          defaults: {
            networkId: 'fast-development',
          },
          sign: createSignWithKeypair([sender00Account]),
        },
      ).execute();

      expect(result).toBe('success');
    });
  });
});
