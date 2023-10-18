import type Client from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import type {
  IExecutionPayloadObject,
  IPactCommand,
} from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import type { ISingleSignFunction } from '../../ISignFunction';
import { createWalletConnectSign } from '../signWithWalletConnect';
import type { TWalletConnectChainId } from '../walletConnectTypes';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('signWithWalletConnect', () => {
  let transaction: IPactCommand & { payload: IExecutionPayloadObject };
  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';
  let signWithWalletConnect: ISingleSignFunction;

  beforeEach(() => {
    transaction = {
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

    const signedTransaction = await signWithWalletConnect(
      createTransaction(transaction),
    );

    expect(client.request).toHaveBeenCalledWith({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'kadena_sign_v1',
        params: {
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

    //@ts-ignore
    delete transaction.payload.exec;

    try {
      await signWithWalletConnect(createTransaction(transaction));
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('`cont` transactions are not supported');
    }
  });

  it('adds an empty clist when signer.clist is undefined', async () => {
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

    //@ts-ignore
    delete transaction.signers[0].clist;

    await signWithWalletConnect(createTransaction(transaction));

    expect(client.request).toHaveBeenCalledWith({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'kadena_sign_v1',
        params: {
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
