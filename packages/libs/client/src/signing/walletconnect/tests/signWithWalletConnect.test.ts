import { describe, expect, it, vi } from 'vitest';
import type {
  IExecutionPayloadObject,
  IPactCommand,
} from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { createSignWithWalletConnect } from '../signWithWalletConnect';
import type { TWalletConnectChainId } from '../walletConnectTypes';

import type Client from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';

type Transaction = IPactCommand & { payload: IExecutionPayloadObject };

describe('signWithWalletConnect', () => {
  const transaction = Object.freeze<Transaction>({
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

  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';

  it('signs a transaction', async () => {
    const client = {
      request: vi.fn(() =>
        Promise.resolve({
          body: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
          catch: vi.fn(),
        }),
      ),
    };

    const signWithWalletConnect = createSignWithWalletConnect(
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
      request: vi.fn(() =>
        Promise.resolve({
          catch: vi.fn(),
        }),
      ),
    };

    const signWithWalletConnect = createSignWithWalletConnect(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    const tx = structuredClone(transaction);
    // @ts-ignore
    delete tx.payload.exec;

    await expect(() =>
      signWithWalletConnect(createTransaction(tx)),
    ).rejects.toThrowError('`cont` transactions are not supported');
  });

  it('adds an empty clist when signer.clist is undefined', async () => {
    const client = {
      request: vi.fn(() =>
        Promise.resolve({
          body: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
          catch: vi.fn(),
        }),
      ),
    };

    const signWithWalletConnect = createSignWithWalletConnect(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    const tx = structuredClone(transaction);
    delete tx.signers[0].clist;

    await signWithWalletConnect(createTransaction(tx));

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
      request: vi.fn(() =>
        Promise.resolve({
          catch: vi.fn(),
        }),
      ),
    };

    const signWithWalletConnect = createSignWithWalletConnect(
      client as unknown as Client,
      session,
      walletConnectChainId,
    );

    await expect(() =>
      signWithWalletConnect(createTransaction(transaction)),
    ).rejects.toThrowError('Error signing transaction');
  });
});
