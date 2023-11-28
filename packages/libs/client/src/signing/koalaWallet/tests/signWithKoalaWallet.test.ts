import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
/** @vitest-environment jsdom */

import type {
  IExecutionPayloadObject,
  IPactCommand,
} from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { createKoalaWalletSign } from '../signWithKoalaWallet';

import { TextDecoder, TextEncoder } from 'util';

type Transaction = IPactCommand & { payload: IExecutionPayloadObject };

Object.assign(global, { TextDecoder, TextEncoder });

describe('signWithKoalaWallet', () => {
  const getTransaction = (): Transaction => ({
    payload: {
      exec: {
        code: '(coin.transfer "bonnie" "clyde" 1)',
        data: {
          test: 'test-data',
        },
      },
    },
    meta: {
      chainId: '0',
      gasLimit: 2300,
      gasPrice: 0.00000001,
      sender: 'test-sender',
      ttl: 3600,
      creationTime: 123456789,
    },
    signers: [
      {
        pubKey: '',
        clist: [
          {
            name: 'cap.test-cap-name',
            args: ['test-cap-arg'],
          },
        ],
      },
    ],
    networkId: 'test-network-id',
    nonce: 'kjs-test',
  });

  const mockKoalaRequest = vi.fn();

  Object.defineProperty(window, 'koala', {
    value: {
      isKadena: true,
      isKoala: true,
      request: mockKoalaRequest,
    },
    writable: true,
  });

  beforeEach(() => {
    mockKoalaRequest.mockReset();
  });

  afterAll(() => {
    mockKoalaRequest.mockRestore();
  });

  it('signs a transaction', async () => {
    mockKoalaRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    const signWithKoalaWallet = createKoalaWalletSign();
    const transaction = getTransaction();
    const signedTransaction = await signWithKoalaWallet(
      createTransaction(transaction),
    );

    expect(mockKoalaRequest).toHaveBeenCalledWith({
      method: 'kda_requestSign',
      data: {
        networkId: 'test-network-id',
        signingCmd: {
          code: transaction.payload.exec.code,
          data: transaction.payload.exec.data,
          caps: [
            {
              role: 'test-cap-name',
              description: 'Description for cap.test-cap-name',
              cap: {
                name: 'cap.test-cap-name',
                args: ['test-cap-arg'],
              },
            },
          ],
          nonce: transaction.nonce,
          chainId: transaction.meta.chainId,
          gasLimit: transaction.meta.gasLimit,
          gasPrice: transaction.meta.gasPrice,
          sender: transaction.meta.sender,
          ttl: transaction.meta.ttl,
        },
      },
    });

    expect(signedTransaction.cmd).toBe('test-cmd');

    expect(signedTransaction).toEqual({
      cmd: 'test-cmd',
      sigs: [{ sig: 'test-sig' }],
    });
  });

  it('throws when there is no signing response', async () => {
    const signWithKoalaWallet = createKoalaWalletSign();

    const transaction = getTransaction();
    //@ts-expect-error The operand of a 'delete' operator must be optional.
    delete transaction.payload.exec;

    await expect(() =>
      signWithKoalaWallet(createTransaction(transaction)),
    ).rejects.toThrowError('`cont` transactions are not supported');
  });

  it('adds an empty clist when signer.clist is undefined', async () => {
    mockKoalaRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    const signWithKoalaWallet = createKoalaWalletSign();

    const transaction = getTransaction();
    delete transaction.signers[0].clist;

    await signWithKoalaWallet(createTransaction(transaction));

    expect(window.koala?.request).toHaveBeenCalledWith({
      method: 'kda_requestSign',
      data: {
        networkId: 'test-network-id',
        signingCmd: {
          code: transaction.payload.exec.code,
          data: transaction.payload.exec.data,
          caps: [],
          nonce: transaction.nonce,
          chainId: transaction.meta.chainId,
          gasLimit: transaction.meta.gasLimit,
          gasPrice: transaction.meta.gasPrice,
          sender: transaction.meta.sender,
          ttl: transaction.meta.ttl,
        },
      },
    });
  });

  it('throws when signing cont command', async () => {
    const transaction = getTransaction();
    const signWithKoalaWallet = createKoalaWalletSign();

    await expect(() =>
      signWithKoalaWallet(createTransaction(transaction)),
    ).rejects.toThrowError('Error signing transaction');
  });
});
