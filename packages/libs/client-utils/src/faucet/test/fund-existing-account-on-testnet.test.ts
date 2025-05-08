import { describe, expect, it } from 'vitest';
import { fundExistingAccountOnTestnetCommand } from '../fund-existing-account-on-testnet';

describe('fundExistingAccountOnTestnetCommand', () => {
  it('it should create coin-faucet.request-coin transaction', () => {
    const command = fundExistingAccountOnTestnetCommand({
      account: 'account',
      amount: 20,
      chainId: '1',
      signerKeys: ['signerKeys'],
      faucetAccount: 'faucetAccount',
      contract: 'coin-faucet',
    })();

    expect(command).toMatchObject({
      payload: {
        exec: { code: '(coin-faucet.request-coin "account" 20.0)', data: {} },
      },
      signers: [
        {
          pubKey: 'signerKeys',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin-faucet.GAS_PAYER',
              args: ['account', { int: 1 }, { decimal: '1.0' }],
            },
            {
              name: 'coin.TRANSFER',
              args: ['faucetAccount', 'account', { decimal: '20.0' }],
            },
          ],
        },
      ],
      meta: {
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: 'faucetAccount',
        ttl: 900,
        chainId: '1',
      },
      networkId: 'testnet04',
    });
  });
});
