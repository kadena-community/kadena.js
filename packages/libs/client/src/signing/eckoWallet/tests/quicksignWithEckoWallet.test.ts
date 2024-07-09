import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
/** @vitest-environment jsdom */

import type { IPactCommand } from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { createEckoWalletQuicksign } from '../quicksignWithEckoWallet';

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

describe('quicksignWithEckoWallet', () => {
  const getTransaction = (): IPactCommand => ({
    payload: {
      exec: {
        code: '(coin.transfer "bonnie" "clyde" 1)',
        data: { 'test-data': 'test-data' },
      },
    },
    meta: {
      chainId: '1',
      gasLimit: 10000,
      gasPrice: 1e-8,
      sender: 'test-sender',
      ttl: 30 * 6,
      creationTime: 1234,
    },
    signers: [
      {
        clist: [
          {
            name: 'test-cap-name',
            args: ['test-cap-arg'],
          },
        ],
        pubKey: 'test-pub-key',
      },
    ],
    networkId: 'testnet-id',
    nonce: '',
  });

  const mockEckoRequest = vi.fn();

  Object.defineProperty(window, 'kadena', {
    value: {
      isKadena: true,
      request: mockEckoRequest,
    },
    writable: true,
  });

  beforeEach(() => {
    mockEckoRequest.mockReset();
  });

  afterAll(() => {
    mockEckoRequest.mockRestore();
  });

  it('throws when no transactions are passed', async () => {
    const quicksignWithEckoWallet = createEckoWalletQuicksign();

    // @ts-expect-error - Expected 1 arguments, but got 0.
    await expect(() => quicksignWithEckoWallet()).rejects.toThrowError(
      'No transaction(s) to sign',
    );
  });

  it('signs a transaction', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      quickSignData: [
        {
          outcome: {
            result: 'success',
            hash: 'test-hash',
          },
          commandSigData: {
            cmd: 'test-cmd',
            sigs: [
              {
                caps: [
                  {
                    args: ['test-cap-arg'],
                    name: 'test-cap-name',
                  },
                ],
                pubKey: 'test-pub-key',
                sig: 'test-sig',
              },
            ],
          },
        },
      ],
    });

    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();
    const unsignedTransaction = createTransaction(transaction);
    unsignedTransaction.hash = 'test-hash';
    const result = await quicksignWithEckoWallet(unsignedTransaction);

    expect(window.kadena?.request).toHaveBeenCalledWith({
      method: 'kda_requestQuickSign',
      data: {
        networkId: 'testnet-id',
        commandSigDatas: [
          {
            cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key"}],"networkId":"testnet-id","nonce":""}',
            sigs: [
              {
                pubKey: 'test-pub-key',
                sig: null,
              },
            ],
          },
        ],
      },
    });

    expect(result).toEqual({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key"}],"networkId":"testnet-id","nonce":""}',
      hash: 'test-hash',
      sigs: [{ sig: 'test-sig', pubKey: 'test-pub-key' }],
    });
  });

  it('signs multiple transactions', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      quickSignData: [
        {
          outcome: {
            result: 'success',
            hash: 'test-hash',
          },
          commandSigData: {
            cmd: 'test-cmd',
            sigs: [
              {
                caps: [
                  {
                    args: ['test-cap-arg'],
                    name: 'test-cap-name',
                  },
                ],
                pubKey: 'test-pub-key',
                sig: 'test-sig',
              },
            ],
          },
        },
        {
          outcome: {
            result: 'success',
            hash: 'test-hash-2',
          },
          commandSigData: {
            cmd: 'test-cmd-2',
            sigs: [
              {
                caps: [
                  {
                    args: ['test-cap-arg'],
                    name: 'test-cap-name',
                  },
                ],
                pubKey: 'test-pub-key-2',
                sig: 'test-sig-2',
              },
            ],
          },
        },
      ],
    });

    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();
    const unsignedTransactions = [
      createTransaction(transaction),
      createTransaction({
        ...getTransaction(),
        signers: [
          {
            clist: [
              {
                name: 'test-cap-name',
                args: ['test-cap-arg'],
              },
            ],
            pubKey: 'test-pub-key-2',
          },
        ],
      }),
    ];
    unsignedTransactions[0].hash = 'test-hash';
    unsignedTransactions[1].hash = 'test-hash-2';
    const result = await quicksignWithEckoWallet(unsignedTransactions);

    expect(window.kadena?.request).toHaveBeenCalledWith({
      method: 'kda_requestQuickSign',
      data: {
        networkId: 'testnet-id',
        commandSigDatas: [
          {
            cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key"}],"networkId":"testnet-id","nonce":""}',
            sigs: [
              {
                pubKey: 'test-pub-key',
                sig: null,
              },
            ],
          },
          {
            cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key-2"}],"networkId":"testnet-id","nonce":""}',
            sigs: [
              {
                pubKey: 'test-pub-key-2',
                sig: null,
              },
            ],
          },
        ],
      },
    });

    expect(result).toEqual([
      {
        cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key"}],"networkId":"testnet-id","nonce":""}',
        hash: 'test-hash',
        sigs: [{ sig: 'test-sig', pubKey: 'test-pub-key' }],
      },
      {
        cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key-2"}],"networkId":"testnet-id","nonce":""}',
        hash: 'test-hash-2',
        sigs: [{ sig: 'test-sig-2', pubKey: 'test-pub-key-2' }],
      },
    ]);
  });

  it('throws when there is no signing response', async () => {
    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();

    await expect(() =>
      quicksignWithEckoWallet(createTransaction(transaction)),
    ).rejects.toThrowError('Error signing transaction');
  });

  it('throws when there is no quickSignData in the response from Ecko', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
    });

    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();
    const unsignedTransaction = createTransaction(transaction);

    await expect(() =>
      quicksignWithEckoWallet(unsignedTransaction),
    ).rejects.toThrowError('Error signing transaction');
  });

  it('throws when there are no responses', async () => {
    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();
    await expect(() =>
      quicksignWithEckoWallet(createTransaction(transaction)),
    ).rejects.toThrowError('Error signing transaction');
  });

  it('throws when the hash of the unsigned and signed transaction do not match', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      quickSignData: [
        {
          outcome: {
            result: 'success',
            hash: 'test-hash-different',
          },
          commandSigData: {
            cmd: 'test-cmd',
            sigs: [
              {
                caps: [
                  {
                    args: ['test-cap-arg'],
                    name: 'test-cap-name',
                  },
                ],
                pubKey: 'test-pub-key',
                sig: 'test-sig',
              },
            ],
          },
        },
      ],
    });

    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();

    await expect(() =>
      quicksignWithEckoWallet(createTransaction(transaction)),
    ).rejects.toThrowError(
      'Hash of the transaction signed by the wallet does not match. Our hash',
    );
  });

  it('throws when the networks of the transactions are not the same', async () => {
    const quicksignWithEckoWallet = createEckoWalletQuicksign();
    const transaction = getTransaction();

    await expect(() =>
      quicksignWithEckoWallet([
        createTransaction(transaction),
        createTransaction({ ...transaction, networkId: 'testnet-id-2' }),
      ]),
    ).rejects.toThrowError('Network is not equal for all transactions');
  });
});
