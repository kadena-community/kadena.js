import { PactCommand } from '../../../pact';
import { ISignSingleFunction } from '../ISignFunction';
import { createWalletConnectSign } from '../signWithWalletConnect';
import { TWalletConnectChainId } from '../walletConnectTypes';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('signWithWalletConnect', () => {
  let transaction: PactCommand;
  const session = { topic: 'test-topic' } as unknown as SessionTypes.Struct;
  const walletConnectChainId: TWalletConnectChainId = 'kadena:testnet04';
  let signWithWalletConnect: ISignSingleFunction;

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
        },
      ],
      createCommand: jest.fn(),
      addSignatures: jest.fn(),
    });
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

    const result = await signWithWalletConnect(transaction);

    expect(client.request).toHaveBeenCalledWith({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: {
        id: 1,
        jsonrpc: '2.0',
        method: 'kadena_sign_v1',
        params: {
          code: transaction.code,
          data: transaction.data,
          caps: [
            {
              role: 'test-cap-name',
              description: 'Description for test-cap-name',
              cap: {
                name: 'test-cap-name',
                args: ['test-cap-arg'],
              },
            },
          ],
          nonce: transaction.nonce,
          chainId: transaction.publicMeta.chainId,
          gasLimit: transaction.publicMeta.gasLimit,
          gasPrice: transaction.publicMeta.gasPrice,
          sender: transaction.publicMeta.sender,
          ttl: transaction.publicMeta.ttl,
        },
      },
    });

    expect(transaction.createCommand).toHaveBeenCalled();

    expect(transaction.addSignatures).toHaveBeenCalledWith({
      ...transaction.signers[0],
      sig: 'test-sig',
    });

    expect(transaction.cmd).toBe('test-cmd');

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
      await signWithWalletConnect(transaction);
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Error signing transaction');
    }
  });
});
