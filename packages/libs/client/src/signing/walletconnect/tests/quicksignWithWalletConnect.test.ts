import { type IPactCommand } from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { type ISignFunction } from '../../ISignFunction';
import { createWalletConnectQuicksign } from '../quicksignWithWalletConnect';
import { type TWalletConnectChainId } from '../walletConnectTypes';

import type Client from '@walletconnect/sign-client';
import { type SessionTypes } from '@walletconnect/types';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('quicksignWithWalletConnect', () => {
  let transaction: IPactCommand;
  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';
  let quicksignWithWalletConnect: ISignFunction;

  beforeEach(() => {
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
        ttl: 30 * 6 /* time for 6 blocks to be mined */,
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

  it('throws when no transactions are passed', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          catch: jest.fn(),
        }),
      ),
    };

    const quicksignWithWalletConnect: ISignFunction =
      createWalletConnectQuicksign(
        client as unknown as Client,
        session,
        walletConnectChainId,
      );

    try {
      // @ts-ignore
      await quicksignWithWalletConnect();
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('No transaction(s) to sign');
    }
  });

  it('signs a transaction', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          responses: [
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
          catch: jest.fn(),
        }),
      ),
    };

    quicksignWithWalletConnect = createWalletConnectQuicksign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    const unsignedTransaction = createTransaction(transaction);
    unsignedTransaction.hash = 'test-hash';
    const result = await quicksignWithWalletConnect(unsignedTransaction);

    expect(client.request).toHaveBeenCalledWith({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'kadena_quicksign_v1',
        params: {
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
      },
    });

    expect(result).toEqual({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bonnie\\" \\"clyde\\" 1)","data":{"test-data":"test-data"}}},"meta":{"chainId":"1","gasLimit":10000,"gasPrice":1e-8,"sender":"test-sender","ttl":180,"creationTime":1234},"signers":[{"clist":[{"name":"test-cap-name","args":["test-cap-arg"]}],"pubKey":"test-pub-key"}],"networkId":"testnet-id","nonce":""}',
      hash: 'test-hash',
      sigs: [{ sig: 'test-sig' }],
    });
  });

  it('throws when there is no signing response', async () => {
    const client = {
      request: jest.fn(() => Promise.resolve()),
    };

    quicksignWithWalletConnect = createWalletConnectQuicksign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    try {
      await quicksignWithWalletConnect(createTransaction(transaction));
      // Fail test if quicksignWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });

  it('throws when there are no responses', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          catch: jest.fn(),
        }),
      ),
    };

    quicksignWithWalletConnect = createWalletConnectQuicksign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    try {
      await quicksignWithWalletConnect(createTransaction(transaction));
      // Fail test if quicksignWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });

  it('throws when the hash of the unsigned and signed transaction do not match', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          responses: [
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
          catch: jest.fn(),
        }),
      ),
    };

    quicksignWithWalletConnect = createWalletConnectQuicksign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    try {
      await quicksignWithWalletConnect(createTransaction(transaction));
      // Fail test if quicksignWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain(
        'Hash of the transaction signed by the wallet does not match. Our hash',
      );
    }
  });
});
