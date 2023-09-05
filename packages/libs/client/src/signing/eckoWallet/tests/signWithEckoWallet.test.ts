/** @jest-environment jsdom */

import type {
  IExecutionPayloadObject,
  IPactCommand,
} from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import type { ISingleSignFunction } from '../../ISignFunction';
import { createEckoWalletSign } from '../signWithEckoWallet';

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const mockEckoRequest = jest.fn();

Object.defineProperty(window, 'kadena', {
  value: {
    isKadena: true,
    request: mockEckoRequest,
  },
});

describe('signWithEckoWallet', () => {
  let transaction: IPactCommand & { payload: IExecutionPayloadObject };
  let signWithEckoWallet: ISingleSignFunction;

  beforeEach(() => {
    mockEckoRequest.mockReset();

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

  afterAll(() => {
    mockEckoRequest.mockRestore();
  });

  it('signs a transaction', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    signWithEckoWallet = createEckoWalletSign();

    const signedTransaction = await signWithEckoWallet(
      createTransaction(transaction),
    );

    expect(mockEckoRequest).toHaveBeenCalledWith({
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
    signWithEckoWallet = createEckoWalletSign();

    //@ts-expect-error The operand of a 'delete' operator must be optional.
    delete transaction.payload.exec;

    try {
      await signWithEckoWallet(createTransaction(transaction));
      // Fail test if signWithWalletConnect() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('`cont` transactions are not supported');
    }
  });

  it('adds an empty clist when signer.clist is undefined', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    signWithEckoWallet = createEckoWalletSign();

    delete transaction.signers[0].clist;

    await signWithEckoWallet(createTransaction(transaction));

    expect(window.kadena?.request).toHaveBeenCalledWith({
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
    signWithEckoWallet = createEckoWalletSign();

    try {
      await signWithEckoWallet(createTransaction(transaction));
      // Fail test if signWithEckoWallet() doesn't throw. Next line shouldn't be reached.
      expect(true).toBe(false);
    } catch (e) {
      console.log(e);
      expect(e.message).toContain('Error signing transaction');
    }
  });
});
