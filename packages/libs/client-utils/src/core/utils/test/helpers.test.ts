import { describe, expect, it, vi } from 'vitest';

import type { ICommandResult } from '@kadena/chainweb-node-client';
import type { SuccessfulResponse } from '../helpers';
import {
  asyncLock,
  checkSuccess,
  composeWithDefaults,
  extractResult,
  inspect,
  pickFirst,
  safeSign,
  throwIfFails,
  validateSign,
  withInput,
} from '../helpers';

describe('inspect', () => {
  it('returns the value passed in', () => {
    expect(inspect('tag')(1)).toBe(1);
  });
});

describe('validateSign', () => {
  it('check if hash of the tx is not changed ', () => {
    const unsignedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    expect(validateSign(unsignedTx, signedTx)).toStrictEqual(signedTx);
  });

  it('throws exception if the hash of the tx is changed', () => {
    const unsignedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    const signedTx = {
      cmd: 'cmd',
      hash: 'inout-hash',
      sigs: [{ sig: 'sig' }],
    };
    expect(() => validateSign(unsignedTx, signedTx)).toThrowError(
      new Error('Hash mismatch'),
    );
  });
  it('throws exception if the tx is not signed', () => {
    const unsignedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    expect(() => validateSign(unsignedTx, signedTx)).toThrowError(
      new Error('Signing failed'),
    );
  });
});

describe('safeSign', () => {
  it('adds signature to the tx by using sign function', async () => {
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    const sign = vi.fn().mockResolvedValue(signedTx);
    const signFn = safeSign(sign);

    const result = await signFn({
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    });

    expect(result).toStrictEqual(signedTx);
  });

  it('throws exception if the sign function changes hash', async () => {
    const signedTx = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    const sign = vi.fn().mockResolvedValue(signedTx);
    const signFn = safeSign(sign);

    await expect(
      signFn({
        cmd: 'cmd',
        hash: 'inout-hash',
        sigs: [undefined],
      }),
    ).rejects.toEqual(new Error('Hash mismatch'));
  });
});

describe('withInput', () => {
  it('returns a tuple of [input,output]', async () => {
    await expect(withInput(() => 'output')('input')).resolves.toEqual([
      'input',
      'output',
    ]);
  });
});

describe('withInput', () => {
  it('returns input if callback passes successfully', async () => {
    await expect(checkSuccess(() => 'output')('input')).resolves.toEqual(
      'input',
    );
  });

  it('throws callback error', async () => {
    await expect(
      checkSuccess((data) => {
        throw new Error(`Error<${data}>`);
      })('input'),
    ).rejects.toThrowError(new Error(`Error<input>`));
  });

  it('reject promise if failed', async () => {
    await expect(
      checkSuccess((data) => {
        return Promise.reject(new Error(`Error<${data}>`));
      })('input'),
    ).rejects.toThrowError(new Error(`Error<input>`));
  });
});

describe('pickFirst', () => {
  it('returns the first element of the array', () => {
    expect(pickFirst([1, 2, 3])).toBe(1);
  });
});

describe('pickFirst', () => {
  it('returns the first element of the array', () => {
    expect(pickFirst([1, 2, 3])).toBe(1);
  });
});

describe('throwIfFails', () => {
  it('returns input if the status is success', () => {
    expect(
      throwIfFails({
        result: { status: 'success', data: 'test' },
      } as unknown as ICommandResult),
    ).toEqual({ result: { status: 'success', data: 'test' } });
  });

  it('throws a exception if the staus is not success', () => {
    expect(() =>
      throwIfFails({
        result: { status: 'failure', error: 'error-message' },
      } as unknown as ICommandResult),
    ).toThrow('error-message');
  });
});

describe('extractResult', () => {
  it('returns data if it is success', () => {
    expect(
      extractResult({
        result: { status: 'success', data: 'test-data' },
      } as unknown as SuccessfulResponse),
    ).toBe('test-data');
  });

  it('returns undefined if it is not success', () => {
    expect(
      extractResult({
        result: {
          status: 'failure',
          data: 'failure-data',
          error: 'error-message',
        },
      } as unknown as SuccessfulResponse),
    ).toBe(undefined);
  });
});

describe('asyncLock', () => {
  it('returns an object with a promise that resolves when the open is called', async () => {
    const lock = asyncLock();
    const wait = lock.waitTillOpen();
    lock.open();
    await wait;
    expect(true).toBe(true);
  });

  it('returns an object with a promise that resolves when the open is called', async () => {
    const lock = asyncLock();
    const wait = lock.waitTillOpen();
    const result = await Promise.race([
      new Promise((resolve) => setTimeout(() => resolve('timeout'), 100)),
      wait.then(() => 'should not resolve'),
    ]);
    expect(result).toBe('timeout');
  });
});

describe('composeWithDefaults', () => {
  it('returns a function that returns the input', () => {
    const command = composeWithDefaults(
      { meta: { chainId: '1', creationTime: 0 } },
      {
        meta: {
          chainId: '2',
          creationTime: 1,
          gasLimit: 1,
          sender: 'sender',
          ttl: 1,
        },
        networkId: 'networkId',
      },
    )({ meta: { chainId: '3', gasPrice: 2 }, nonce: 'nonce', signers: [] });

    expect(command).toEqual({
      meta: {
        chainId: '3',
        creationTime: 0,
        gasLimit: 1,
        gasPrice: 2,
        sender: 'sender',
        ttl: 1,
      },
      networkId: 'networkId',
      nonce: 'nonce',
      signers: [],
    });
  });
});
