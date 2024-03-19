import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICoin } from '../../composePactCommand/test/coin-contract';
import type { IExecutionPayloadObject } from '../../interfaces/IPactCommand';
import { getModule } from '../../pact';
import { createTransactionBuilder } from '../createTransactionBuilder';

const coin: ICoin = getModule('coin');

describe('createTransactionBuilder', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-07-27'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns exec payload', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns cont payload', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .continuation({
        pactId: '1',
        proof: 'proof',
        rollback: false,
        step: 1,
      })
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        cont: {
          pactId: '1',
          proof: 'proof',
          data: {},
          rollback: false,
          step: 1,
        },
      },
      signers: [],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns command with signers', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addSigner('bob_pubkey', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '12' }),
      ])
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [
        {
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['bob', 'alice', { decimal: '12' }],
              name: 'coin.TRANSFER',
            },
          ],
          pubKey: 'bob_pubkey',
          scheme: 'ED25519',
        },
      ],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns command with verifiers', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addVerifier(
        { name: 'test-verifier', proof: 'test-proof' },
        (forCapability) => [
          forCapability('coin.GAS'),
          forCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '12' }),
        ],
      )
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      verifiers: [
        {
          name: 'test-verifier',
          proof: 'test-proof',
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['bob', 'alice', { decimal: '12' }],
              name: 'coin.TRANSFER',
            },
          ],
        },
      ],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns command with meta', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setMeta({ chainId: '0' })
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      meta: {
        chainId: '0',
        creationTime: 1690416000,
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: '',
        ttl: 28800,
      },
      nonce: 'kjs:nonce:1690416000000',
    });
  });
  it('returns command with custom nonce', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNonce('test-nonce')
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'test-nonce',
    });
  });

  it('returns command with custom nonce by using nonce generator', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNonce((cmd) => {
        return `test-nonce:${
          (cmd.payload as IExecutionPayloadObject).exec.code
        }`;
      })
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'test-nonce:(coin.transfer "bob" "alice" 12.0)',
    });
  });

  it('returns command with network', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNetworkId('mainnet01')
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      networkId: 'mainnet01',
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns unsigned transaction', () => {
    const builder = createTransactionBuilder();
    const unSignedTr = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addSigner('bob_bup_key')
      .setNetworkId('mainnet01')
      .createTransaction();

    expect(unSignedTr).toStrictEqual({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bob\\" \\"alice\\" 12.0)","data":{}}},"nonce":"kjs:nonce:1690416000000","signers":[{"pubKey":"bob_bup_key","scheme":"ED25519"}],"networkId":"mainnet01"}',
      hash: '_sjzo-mOADRp7XEXIupbNHTGrKzbm-A3fKZhtzXcwxM',
      sigs: [undefined],
    });
  });

  it('returns exec command with data', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addData('test', 'value')
      .getCommand();

    expect(command).toEqual({
      nonce: 'kjs:nonce:1690416000000',
      payload: {
        exec: {
          code: '(coin.transfer "bob" "alice" 12.0)',
          data: { test: 'value' },
        },
      },
      signers: [],
    });
  });

  it('returns cont command with data', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .continuation({ pactId: '1', rollback: false, step: 1 })
      .addData('test', 'value')
      .getCommand();

    expect(command).toEqual({
      nonce: 'kjs:nonce:1690416000000',
      payload: {
        cont: {
          pactId: '1',
          data: { test: 'value' },
          rollback: false,
          proof: null,
          step: 1,
        },
      },
      signers: [],
    });
  });

  it('returns command with keyset', () => {
    const builder = createTransactionBuilder();
    const command = builder
      .execution(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addKeyset('ks', 'keys-all', 'pub1', 'pub2')
      .getCommand();

    expect(command).toEqual({
      nonce: 'kjs:nonce:1690416000000',
      payload: {
        exec: {
          code: '(coin.transfer "bob" "alice" 12.0)',
          data: {
            ks: {
              pred: 'keys-all',
              keys: ['pub1', 'pub2'],
            },
          },
        },
      },
      signers: [],
    });
  });

  it('accepts initials and merges them to the final result', () => {
    const builder = createTransactionBuilder({
      networkId: 'my-network',
      meta: {
        chainId: '0',
        sender: 'sender',
        gasLimit: 1,
        gasPrice: 1,
        ttl: 1,
        creationTime: 1,
      },
    });
    const command = builder.execution('(+ 1 1)').getCommand();

    expect(command).toEqual({
      meta: {
        chainId: '0',
        creationTime: 1,
        gasLimit: 1,
        gasPrice: 1,
        sender: 'sender',
        ttl: 1,
      },
      networkId: 'my-network',
      nonce: 'kjs:nonce:1690416000000',
      payload: { exec: { code: '(+ 1 1)', data: {} } },
      signers: [],
    });
  });
});
