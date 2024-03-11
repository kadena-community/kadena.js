import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addSigner,
  continuation,
  execution,
  setMeta,
  setNetworkId,
  setNonce,
} from '../../fp';
import type { IPactCommand } from '../../interfaces/IPactCommand';
import { getModule } from '../../pact';
import { createTransaction } from '../../utils/createTransaction';
import { composePactCommand } from '../composePactCommand';
import { addData } from '../utils/addData';
import { addVerifier } from '../utils/addVerifier';
import { mergePayload } from '../utils/patchCommand';
import type { ICoin } from './coin-contract';

const coin: ICoin = getModule('coin');

describe('execution', () => {
  it('returns a payload object of a exec command', () => {
    const command = execution(
      coin.transfer('alice', 'bob', { decimal: '12.1' }),
    );
    expect(command.payload.exec.code).toBe(
      '(coin.transfer "alice" "bob" 12.1)',
    );
  });

  it('adds multiple command', () => {
    const command = execution(
      coin.transfer('alice', 'bob', { decimal: '0.1' }),
      coin.transfer('bob', 'alice', { decimal: '0.1' }),
    );
    expect(command.payload.exec.code).toBe(
      '(coin.transfer "alice" "bob" 0.1)(coin.transfer "bob" "alice" 0.1)',
    );
  });
});

describe('continuation', () => {
  it('returns a payload object of a cont command', () => {
    const command = continuation({
      pactId: '1',
      proof: 'test-proof',
      step: 1,
      rollback: false,
    });
    expect(command.payload).toEqual({
      cont: {
        pactId: '1',
        proof: 'test-proof',
        rollback: false,
        step: 1,
        data: {},
      },
    });
  });
});

describe('composePactCommand', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-07-27'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns command object with signers and capabilities', () => {
    const command = composePactCommand(
      execution(coin.transfer('alice', 'bob', { decimal: '12.1' })),
      addSigner('bob_public_key', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'alice', 'bob', { decimal: '12.1' }),
      ]),
      setNonce('test-nonce'),
    )();
    expect(command).toStrictEqual({
      payload: {
        exec: {
          code: '(coin.transfer "alice" "bob" 12.1)',
          data: {},
        },
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
    const command = composePactCommand(
      execution(coin.transfer('alice', 'bob', { decimal: '12.1' })),
      addSigner('bob_public_key', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'alice', 'bob', { decimal: '12.1' }),
      ]),
      setMeta({
        chainId: '1',
        senderAccount: 'gas-station',
        gasPrice: 381,
        gasLimit: 400,
        creationTime: 123,
        ttl: 1000,
      }),
      setNetworkId('test-network-id'),
      setNonce('test-nonce'),
    )();

    expect(command).toStrictEqual({
      payload: {
        exec: {
          code: '(coin.transfer "alice" "bob" 12.1)',
          data: {},
        },
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

  it('adds kjs nonce if not presented in the input', () => {
    const command = composePactCommand(
      execution(coin.transfer('bob', 'alice', { decimal: '1' })),
    )();

    expect(command.nonce).toBe('kjs:nonce:1690416000000');
  });

  it('merges payload if they are exec', () => {
    expect(
      composePactCommand(
        execution(coin.transfer('bob', 'alice', { decimal: '1' })),
        execution(coin.transfer('alice', 'bob', { decimal: '1' })),
      )().payload,
    ).toEqual({
      exec: {
        code: '(coin.transfer "bob" "alice" 1.0)(coin.transfer "alice" "bob" 1.0)',
        data: {},
      },
    });
  });

  it('merges payloads data if they are exec', () => {
    expect(
      composePactCommand(
        execution(
          coin.transfer('bob', 'alice', { decimal: '1' }),
          coin.transfer('alice', 'bob', { decimal: '1' }),
        ),
        addData('one', 'test'),
        addData('two', 'test'),
      )().payload,
    ).toEqual({
      exec: {
        code: '(coin.transfer "bob" "alice" 1.0)(coin.transfer "alice" "bob" 1.0)',
        data: { one: 'test', two: 'test' },
      },
    });
  });

  it('throws exception if payloads are not mergable', () => {
    expect(
      () =>
        composePactCommand(
          execution(coin.transfer('bob', 'alice', { decimal: '1' })),
          continuation({ pactId: '1' }),
        )().payload,
    ).toThrowError(new Error('PAYLOAD_NOT_MERGEABLE'));
  });

  it('accepts a signer without a capability', () => {
    expect(
      composePactCommand(
        execution(coin.transfer('bob', 'alice', { decimal: '1' })),
        addSigner('bob_public_key'),
      )().signers,
    ).toEqual([{ pubKey: 'bob_public_key', scheme: 'ED25519' }]);
  });

  it('merges capability arrays of one signer if presented twice', () => {
    expect(
      composePactCommand(
        execution(coin.transfer('bob', 'alice', { decimal: '1' })),
        addSigner('bob_public_key', (withCapability) => [
          withCapability('coin.GAS'),
        ]),
        addSigner('bob_public_key', (withCapability) => [
          withCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '1' }),
        ]),
      )().signers,
    ).toEqual([
      {
        pubKey: 'bob_public_key',
        scheme: 'ED25519',
        clist: [
          { args: [], name: 'coin.GAS' },
          { args: ['bob', 'alice', { decimal: '1' }], name: 'coin.TRANSFER' },
        ],
      },
    ]);

    expect(
      composePactCommand(
        execution(coin.transfer('bob', 'alice', { decimal: '1' })),
        addSigner('bob_public_key'),
        addSigner('bob_public_key', (withCapability) => [
          withCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '1' }),
        ]),
      )().signers,
    ).toEqual([
      {
        pubKey: 'bob_public_key',
        scheme: 'ED25519',
        clist: [
          { args: ['bob', 'alice', { decimal: '1' }], name: 'coin.TRANSFER' },
        ],
      },
    ]);
  });
  it("adds creationTime if it's not presented in the meta property", () => {
    expect(
      composePactCommand(
        execution(coin.transfer('bob', 'alice', { decimal: '1' })),
        setMeta({ chainId: '1' }),
      )().meta?.creationTime,
    ).toBe(1690416000);
  });

  it('returns transaction object by calling createTransaction', () => {
    expect(
      createTransaction(
        composePactCommand(
          execution(coin.transfer('bob', 'alice', { decimal: '1' })),
          addSigner('bob_public_key'),
          addSigner('bob_public_key', (withCapability) => [
            withCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '1' }),
          ]),
        )(),
      ),
    ).toEqual({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bob\\" \\"alice\\" 1.0)","data":{}}},"signers":[{"pubKey":"bob_public_key","scheme":"ED25519","clist":[{"name":"coin.TRANSFER","args":["bob","alice",{"decimal":"1"}]}]}],"nonce":"kjs:nonce:1690416000000"}',
      hash: 'XjFto2SijaGZpRzdwWdZDkPI7WheTUuIMs8DHaqL2jU',
      sigs: [undefined],
    });
  });

  it('adds does not set sender if its not presented', () => {
    const command = composePactCommand(
      composePactCommand(
        execution('(test)'),
        setMeta({ senderAccount: 'test' }),
      ),
      composePactCommand(execution('(test 2)'), setMeta({ chainId: '1' })),
      setMeta({
        gasLimit: 1,
        gasPrice: 1,
        creationTime: 0,
        ttl: 1,
      }),
    )();

    expect(command.payload).toEqual({
      exec: {
        code: '(test)(test 2)',
        data: {},
      },
    });
    expect(command.meta).toEqual({
      sender: 'test',
      chainId: '1',
      gasLimit: 1,
      gasPrice: 1,
      creationTime: 0,
      ttl: 1,
    });
  });
  it('merge data if they are continuation', () => {
    expect(
      composePactCommand(
        continuation({
          pactId: '1',
          step: 1,
          rollback: false,
          proof: null,
          data: { direct: 'test' },
        }),
        addData('one', 'test'),
      )().payload,
    ).toEqual({
      cont: {
        pactId: '1',
        step: 1,
        rollback: false,
        proof: null,
        data: {
          one: 'test',
          direct: 'test',
        },
      },
    });
  });
});

describe('mergePayload', () => {
  it('merge code part of two payload', () => {
    expect(
      mergePayload({ exec: { code: '(one)' } }, { exec: { code: '(two)' } }),
    ).toEqual({
      exec: {
        code: '(one)(two)',
        data: {},
      },
    });
  });

  it('merge data part of two payload', () => {
    expect(
      mergePayload(
        { exec: { code: '(one)', data: { one: 'test' } } },
        { exec: { code: '(two)', data: { two: 'test' } } },
      ),
    ).toEqual({
      exec: {
        code: '(one)(two)',
        data: {
          one: 'test',
          two: 'test',
        },
      },
    });
  });

  it('returns the non-undefined if one of the inputs is undefined', () => {
    expect(
      mergePayload(
        { exec: { code: '(one)', data: { one: 'test' } } },
        undefined,
      ),
    ).toEqual({ exec: { code: '(one)', data: { one: 'test' } } });

    expect(
      mergePayload(undefined, {
        exec: { code: '(one)', data: { one: 'test' } },
      }),
    ).toEqual({ exec: { code: '(one)', data: { one: 'test' } } });
  });

  it('returns merged data', () => {
    expect(
      mergePayload(
        { cont: { data: { one: 'test' } } },
        { cont: { pactId: '1', data: { two: 'test' } } },
      ),
    ).toEqual({
      cont: {
        pactId: '1',
        data: { one: 'test', two: 'test' },
      },
    });

    expect(
      mergePayload(undefined, {
        exec: { code: '(one)', data: { one: 'test' } },
      }),
    ).toEqual({ exec: { code: '(one)', data: { one: 'test' } } });
  });

  it('should not override input data', () => {
    expect(
      mergePayload(
        { cont: { proof: 'proof', data: { one: 'test' } } },
        { cont: { pactId: '1', data: { two: 'test' } } },
      ),
    ).toEqual({
      cont: {
        pactId: '1',
        proof: 'proof',
        data: { one: 'test', two: 'test' },
      },
    });

    expect(
      mergePayload(undefined, {
        exec: { code: '(one)', data: { one: 'test' } },
      }),
    ).toEqual({ exec: { code: '(one)', data: { one: 'test' } } });
  });

  it('throws error if object are not the same brand', () => {
    expect(() =>
      mergePayload({ exec: { code: 'test' } }, { cont: { pactId: '1' } }),
    ).toThrowError(new Error('PAYLOAD_NOT_MERGEABLE'));
  });

  it('adds creationTime to metadata of mataData is presented but does not have creationTime', () => {
    vi.useFakeTimers().setSystemTime(new Date('2023-07-27'));

    const pactCommand = composePactCommand({
      meta: { chainId: '1' } as IPactCommand['meta'],
    })();
    expect(pactCommand.meta?.creationTime).toBe(1690416000);

    vi.useRealTimers();
  });

  it('returns command object with verifiers and capabilities', () => {
    const command = composePactCommand(
      execution(coin.transfer('alice', 'bob', { decimal: '12.1' })),
      addVerifier(
        { name: 'test-verifier', proof: 'test-proof' },
        (forCapability) => [
          forCapability('coin.GAS'),
          forCapability('coin.TRANSFER', 'alice', 'bob', { decimal: '12.1' }),
        ],
      ),
      setNonce('test-nonce'),
    )();
    expect(command).toStrictEqual({
      payload: {
        exec: {
          code: '(coin.transfer "alice" "bob" 12.1)',
          data: {},
        },
      },
      signers: [],
      verifiers: [
        {
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['alice', 'bob', { decimal: '12.1' }],
              name: 'coin.TRANSFER',
            },
          ],
          name: 'test-verifier',
          proof: '"test-proof"',
        },
      ],
      nonce: 'test-nonce',
    });
  });
});
