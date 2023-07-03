import { PactCommand } from '../../../pact';
import { ISignFunction } from '../ISignFunction';
import { createWalletConnectQuicksign } from '../quicksignWithWalletConnect';
import { TWalletConnectChainId } from '../walletConnectTypes';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('quicksignWithWalletConnect', () => {
  let transaction: PactCommand;
  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';
  let quicksignWithWalletConnect: ISignFunction;

  beforeEach(() => {
    transaction = Object.assign(new PactCommand(), {
      code: '(coin.transfer "bonnie" "clyde" 1)',
      data: 'test-data',
      publicMeta: {
        chainId: 'test-chain-id',
        gasLimit: 'test-gas-limit',
        gasPrice: 'test-gas-price',
        sender: 'test-sender',
        ttl: 'test-ttl',
      },
      signers: [
        {
          caps: [
            {
              name: 'test-cap-name',
              args: ['test-cap-arg'],
            },
          ],
          pubKey: 'test-pub-key',
        },
      ],
      createCommand: jest.fn(() => ({ cmd: 'test-cmd', hash: 'test-hash' })),
      addSignatures: jest.fn(),
    });
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

    const result = await quicksignWithWalletConnect(transaction);

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
              cmd: 'test-cmd',
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

    expect(transaction.createCommand).toHaveBeenCalled();

    expect(transaction.addSignatures).toHaveBeenCalledWith({
      ...transaction.signers[0],
      sig: 'test-sig',
    });

    expect(result).toEqual([
      {
        cmd: 'test-cmd',
        hash: 'test-hash',
      },
    ]);
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
      await quicksignWithWalletConnect(transaction);
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
      await quicksignWithWalletConnect(transaction);
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
      await quicksignWithWalletConnect(transaction);
      // Fail test if quicksignWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain(
        'Hash of the transaction signed by the wallet does not match. Our hash: test-hash, wallet hash: test-hash-different',
      );
    }
  });
});
