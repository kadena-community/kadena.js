import { IPactCommand } from '../../../interfaces/IPactCommand';
import { isExecCommand } from '../../../interfaces/isExecCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { ISignSingleFunction } from '../../ISignFunction';
import { createWalletConnectSign } from '../signWithWalletConnect';
import { TWalletConnectChainId } from '../walletConnectTypes';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('signWithWalletConnect', () => {
  let transaction: IPactCommand;
  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';
  let signWithWalletConnect: ISignSingleFunction;

  beforeEach(() => {
    transaction = {
      payload: {
        code: '(coin.transfer "bonnie" "clyde" 1)',
        data: { 'test-data': 'test-data' },
      },
      meta: {
        chainId: '1',
        gasLimit: 1000,
        gasPrice: 1e-8,
        sender: 'test-sender',
        ttl: 30 * 6 /* time for 6 blocks to be mined */,
        creationTime: 1234,
      },
      signers: [
        {
          pubKey: 'test-pub-key',
          clist: [
            {
              name: 'cap.test-cap-name',
              args: ['test-cap-arg'],
            },
          ],
        },
      ],
      networkId: 'test-network-id',
      nonce: 'test-nonce',
    };
  });

  it('signs a transaction', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          body: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
          catch: jest.fn(),
        }),
      ),
    };

    signWithWalletConnect = createWalletConnectSign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    const result = await signWithWalletConnect(createTransaction(transaction));
    if (!isExecCommand(transaction)) {
      throw new Error('not an exec command');
    }

    expect(client.request).toHaveBeenCalledWith({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'kadena_sign_v1',
        params: {
          code: transaction.payload.code,
          data: transaction.payload.data,
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
    expect(result.cmd).toBe('test-cmd');

    expect(result).toEqual({
      cmd: 'test-cmd',
      sigs: [{ sig: 'test-sig' }],
    });
  });

  it('throws when there is no signing response', async () => {
    const client = {
      request: jest.fn(() =>
        Promise.resolve({
          catch: jest.fn(),
        }),
      ),
    };

    signWithWalletConnect = createWalletConnectSign(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    try {
      await signWithWalletConnect(createTransaction(transaction));
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });
});
