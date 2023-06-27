import { coin } from '../exmaple/coin-contract';
import { commandBuilder, meta, payload, set, signer } from '../pact';

jest.useFakeTimers().setSystemTime(new Date('2023-07-27'));

describe('payload.exec', () => {
  it('returns a payload object of a exec command', () => {
    const command = payload.exec([
      coin.transfer('alice', 'bob', { decimal: '12.1' }),
    ]);
    expect(command.payload.code).toBe('(coin.transfer "alice" "bob" 12.1)');
  });

  it('adds multiple command', () => {
    const command = payload.exec([
      coin.transfer('alice', 'bob', { decimal: '0.1' }),
      coin.transfer('bob', 'alice', { decimal: '0.1' }),
    ]);
    expect(command.payload.code).toBe(
      '(coin.transfer "alice" "bob" 0.1)(coin.transfer "bob" "alice" 0.1)',
    );
  });
});

describe('payload.cont', () => {
  it('returns a payload object of a cont command', () => {
    const command = payload.cont({
      pactId: '1',
      proof: 'test-proof',
      step: '1',
    });
    expect(command.payload).toEqual({
      pactId: '1',
      proof: 'test-proof',
      step: '1',
    });
  });
});

describe('commandBuilder', () => {
  it('returns command object with signers and capabilities', () => {
    const { command } = commandBuilder(
      payload.exec([coin.transfer('alice', 'bob', { decimal: '12.1' })]),
      signer('bob_public_key', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'alice', 'bob', { decimal: '12.1' }),
      ]),
      set('nonce', 'test-nonce'),
    );
    expect(command).toStrictEqual({
      payload: {
        code: '(coin.transfer "alice" "bob" 12.1)',
      },
      signers: [
        {
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['alice', 'bob', { decimal: '12.1' }],
              name: 'coin.TRANSFER',
            },
          ],
          pubKey: 'bob_public_key',
          scheme: 'ED25519',
        },
      ],
      nonce: 'test-nonce',
    });
  });

  it('returns a command based on ICommand interface', () => {
    const { command } = commandBuilder(
      payload.exec([coin.transfer('alice', 'bob', { decimal: '12.1' })]),
      signer('bob_public_key', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'alice', 'bob', { decimal: '12.1' }),
      ]),
      meta({
        chainId: '1',
        sender: 'gas-station',
        gasPrice: 381,
        gasLimit: 400,
        creationTime: 123,
        ttl: 1000,
      }),
      set('networkId', 'test-network-id'),
      set('nonce', 'test-nonce'),
    );

    expect(command).toStrictEqual({
      payload: {
        code: '(coin.transfer "alice" "bob" 12.1)',
      },
      signers: [
        {
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['alice', 'bob', { decimal: '12.1' }],
              name: 'coin.TRANSFER',
            },
          ],
          pubKey: 'bob_public_key',
          scheme: 'ED25519',
        },
      ],
      meta: {
        chainId: '1',
        creationTime: 123,
        gasLimit: 400,
        gasPrice: 381,
        sender: 'gas-station',
        ttl: 1000,
      },
      networkId: 'test-network-id',
      nonce: 'test-nonce',
    });
  });

  it('adds kjs nonce  if not presented in the input', () => {
    const { command } = commandBuilder(
      payload.exec([coin.transfer('bob', 'alice', { decimal: '1' })]),
    );

    expect(command.nonce).toBe('kjs-1690416000000');
  });
});
