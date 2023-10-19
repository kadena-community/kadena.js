/** @jest-environment jsdom */
import { TextDecoder, TextEncoder } from 'util';
import type { IPactCommand } from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import type { ISignFunction } from '../../ISignFunction';
import { createEckoWalletQuicksign } from '../quicksignWithEckoWallet';

Object.assign(global, { TextDecoder, TextEncoder });

const mockEckoRequest = jest.fn();

Object.defineProperty(window, 'kadena', {
  value: {
    isKadena: true,
    request: mockEckoRequest,
  },
});

describe('quicksignWithEckoWallet', () => {
  let transaction: IPactCommand;
  let quicksignWithEckoWallet: ISignFunction;

  beforeEach(() => {
    mockEckoRequest.mockReset();

    transaction = {
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
    };
  });

  afterAll(() => {
    mockEckoRequest.mockRestore();
  });

  it('throws when no transactions are passed', async () => {
    const quicksignWithEckoWallet = createEckoWalletQuicksign();

    try {
      // @ts-expect-error - Expected 1 arguments, but got 0.
      await quicksignWithEckoWallet();
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('No transaction(s) to sign');
    }
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

    quicksignWithEckoWallet = createEckoWalletQuicksign();

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
      sigs: [{ sig: 'test-sig' }],
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

    quicksignWithEckoWallet = createEckoWalletQuicksign();

    const unsignedTransactions = [
      createTransaction(transaction),
      createTransaction({
        ...transaction,
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
        sigs: [{ sig: 'test-sig' }],
      },
      {
        cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key-2"}],"networkId":"testnet-id","nonce":""}',
        hash: 'test-hash-2',
        sigs: [{ sig: 'test-sig-2' }],
      },
    ]);
  });

  it('throws when there is no signing response', async () => {
    quicksignWithEckoWallet = createEckoWalletQuicksign();

    try {
      await quicksignWithEckoWallet(createTransaction(transaction));
      // Fail test if quicksignWithEckoWallet() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });

  it('throws when there is no quickSignData in the response from Ecko', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
    });

    quicksignWithEckoWallet = createEckoWalletQuicksign();
    const unsignedTransaction = createTransaction(transaction);

    try {
      await quicksignWithEckoWallet(unsignedTransaction);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });

  it('throws when there are no responses', async () => {
    quicksignWithEckoWallet = createEckoWalletQuicksign();

    try {
      await quicksignWithEckoWallet(createTransaction(transaction));
      // Fail test if quicksignWithEckoWallet() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
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

    quicksignWithEckoWallet = createEckoWalletQuicksign();

    try {
      await quicksignWithEckoWallet(createTransaction(transaction));
      // Fail test if quicksignWithEckoWallet() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain(
        'Hash of the transaction signed by the wallet does not match. Our hash',
      );
    }
  });

  it('throws when the networks of the transactions are not the same', async () => {
    quicksignWithEckoWallet = createEckoWalletQuicksign();

    try {
      await quicksignWithEckoWallet([
        createTransaction(transaction),
        createTransaction({ ...transaction, networkId: 'testnet-id-2' }),
      ]);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe('Network is not equal for all transactions');
    }
  });
});
