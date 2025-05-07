import { describe, expect, it } from 'vitest';
import { fundNewAccountOnTestnetCommand } from '../fund-new-account-on-testnet';

describe('fundNewAccountOnTestnetCommand', () => {
  it('creates transaction for create-and-request-coin', () => {
    const account = 'test-account';
    const keyset = {
      keys: ['key1', 'key2'],
      pred: 'keys-all' as const,
    };
    const amount = 100;
    const chainId = '1';
    const signerKeys = ['signerKey1', 'signerKey2'];
    const faucetAccount = 'faucet-account';
    const contract = 'coin-faucet';

    const command = fundNewAccountOnTestnetCommand({
      account,
      keyset,
      amount,
      chainId,
      signerKeys,
      faucetAccount,
      contract,
    })();

    expect(command).toMatchObject({
      payload: {
        exec: {
          code: '(coin-faucet.create-and-request-coin "test-account" (read-keyset "account-guard") 100.0)',
          data: {
            'account-guard': { keys: ['key1', 'key2'], pred: 'keys-all' },
          },
        },
      },
      signers: [
        {
          pubKey: 'signerKey1',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin-faucet.GAS_PAYER',
              args: ['test-account', { int: 1 }, { decimal: '1.0' }],
            },
            {
              name: 'coin.TRANSFER',
              args: ['faucet-account', 'test-account', { decimal: '100.0' }],
            },
          ],
        },
        {
          pubKey: 'signerKey2',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin-faucet.GAS_PAYER',
              args: ['test-account', { int: 1 }, { decimal: '1.0' }],
            },
            {
              name: 'coin.TRANSFER',
              args: ['faucet-account', 'test-account', { decimal: '100.0' }],
            },
          ],
        },
      ],
      meta: {
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: 'faucet-account',
        ttl: 900,
        chainId: '1',
      },
      networkId: 'testnet04',
    });
  });
});
